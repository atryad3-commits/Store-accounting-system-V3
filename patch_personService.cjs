const fs = require('fs');
let code = fs.readFileSync('src/services/personService.ts', 'utf8');

// 1. Imports
const importsToAdd = "import { enqueueSyncTask, getSyncQueue } from './syncQueueService';\n";
code = code.replace(
  "import { convertToGregorian } from '../utils/format';",
  "import { convertToGregorian } from '../utils/format';\n" + importsToAdd
);

// 2. getPersons
const getPersonsMatch = `export const getPersons = async () => {
  const persons = await getLocalData<any[]>('persons', []);
  const contacts = await getLocalData<any[]>('person_contacts', []);
  const bankAccounts = await getLocalData<any[]>('person_bank_accounts', []);
  
  const formattedPersons = (persons || []).map(p => {
     p.contacts = contacts.filter(c => String(c.personId) === String(p.id));
     p.bankAccounts = bankAccounts.filter(b => String(b.personId) === String(p.id));
     return p;
  });
  
  return formattedPersons.filter(p => !p.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};`;

const getPersonsReplacement = `export const getPersons = async () => {
  const persons = await getLocalData<any[]>('persons', []);
  const contacts = await getLocalData<any[]>('person_contacts', []);
  const bankAccounts = await getLocalData<any[]>('person_bank_accounts', []);
  
  const formattedPersons = (persons || []).map(p => {
     p.contacts = contacts.filter(c => String(c.personId) === String(p.id));
     p.bankAccounts = bankAccounts.filter(b => String(b.personId) === String(p.id));
     return p;
  });
  
  const baseList = formattedPersons.filter(p => !p.isDeleted);
  
  // Apply sync queue
  const queue = getSyncQueue();
  let resultList = [...baseList];

  for (const task of queue) {
    if (task.operation === 'ADD_PERSON') {
       resultList.push({ ...task.payload, isLocalUnsynced: true });
    } else if (task.operation === 'UPDATE_PERSON') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList[idx] = { ...resultList[idx], ...task.payload.person, isLocalUnsynced: true };
       }
    } else if (task.operation === 'DELETE_PERSON') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) {
           resultList.splice(idx, 1);
       }
    }
  }

  return resultList.sort((a, b) => b.createdAt - a.createdAt);
};`;

code = code.replace(getPersonsMatch, getPersonsReplacement);

// 3. Rename existing functions
code = code.replace('export const addPerson = async (person: any) => {', 'export const addPersonToServer = async (person: any) => {');
code = code.replace('export const updatePerson = async (id: string, person: any) => {', 'export const updatePersonToServer = async (id: string, person: any) => {');
code = code.replace('export const deletePerson = async (id: string) => {', 'export const deletePersonToServer = async (id: string) => {');

// 4. Add wrapper functions
const wrappers = `
export const addPerson = async (person: any) => {
  const now = Date.now();
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const newPerson = { ...person, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PERSON', newPerson);
  return newPerson;
};

export const updatePerson = async (id: string, person: any) => {
  enqueueSyncTask('UPDATE_PERSON', { id, person });
  return { ...person, id };
};

export const deletePerson = async (id: string) => {
  enqueueSyncTask('DELETE_PERSON', { id });
};
`;

code = code + wrappers;

fs.writeFileSync('src/services/personService.ts', code);
console.log('personService patched');
