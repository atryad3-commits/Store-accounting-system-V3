const fs = require('fs');
let code = fs.readFileSync('src/services/personService.ts', 'utf8');

// 1. Rename to ToServer
code = code.replace('export const addPersonGroup = async (group: any) => {', 'export const addPersonGroupToServer = async (group: any) => {');
code = code.replace('export const updatePersonGroup = async (id: string, group: any) => {', 'export const updatePersonGroupToServer = async (id: string, group: any) => {');
code = code.replace('export const deletePersonGroup = async (id: string) => {', 'export const deletePersonGroupToServer = async (id: string) => {');

code = code.replace('export const addPersonRole = async (role: any) => {', 'export const addPersonRoleToServer = async (role: any) => {');
code = code.replace('export const updatePersonRole = async (id: string, role: any) => {', 'export const updatePersonRoleToServer = async (id: string, role: any) => {');
code = code.replace('export const deletePersonRole = async (id: string) => {', 'export const deletePersonRoleToServer = async (id: string) => {');

code = code.replace('export const addPersonCategory = async (category: any) => {', 'export const addPersonCategoryToServer = async (category: any) => {');
code = code.replace('export const updatePersonCategory = async (id: string, category: any) => {', 'export const updatePersonCategoryToServer = async (id: string, category: any) => {');
code = code.replace('export const deletePersonCategory = async (id: string) => {', 'export const deletePersonCategoryToServer = async (id: string) => {');

// 2. Add wrappers
const wrappers = `
export const addPersonGroup = async (group: any) => {
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const newGroup = { ...group, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PERSON_GROUP', newGroup);
  return newGroup;
};
export const updatePersonGroup = async (id: string, group: any) => {
  enqueueSyncTask('UPDATE_PERSON_GROUP', { id, group });
  return { ...group, id };
};
export const deletePersonGroup = async (id: string) => {
  enqueueSyncTask('DELETE_PERSON_GROUP', { id });
};

export const addPersonRole = async (role: any) => {
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const newRole = { ...role, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PERSON_ROLE', newRole);
  return newRole;
};
export const updatePersonRole = async (id: string, role: any) => {
  enqueueSyncTask('UPDATE_PERSON_ROLE', { id, role });
  return { ...role, id };
};
export const deletePersonRole = async (id: string) => {
  enqueueSyncTask('DELETE_PERSON_ROLE', { id });
};

export const addPersonCategory = async (category: any) => {
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const newCategory = { ...category, id: localId, createdAt: now, updatedAt: now };
  enqueueSyncTask('ADD_PERSON_CATEGORY', newCategory);
  return newCategory;
};
export const updatePersonCategory = async (id: string, category: any) => {
  enqueueSyncTask('UPDATE_PERSON_CATEGORY', { id, category });
  return { ...category, id };
};
export const deletePersonCategory = async (id: string) => {
  enqueueSyncTask('DELETE_PERSON_CATEGORY', { id });
};
`;

code = code + wrappers;

// 3. Patch getters to merge with sync queue
const getGroupsMatch = `export const getPersonGroups = async () => {
  const groups = await getLocalData<any[]>('person_groups', []);
  return groups.sort((a, b) => b.createdAt - a.createdAt);
};`;
const getGroupsRepl = `export const getPersonGroups = async () => {
  const groups = await getLocalData<any[]>('person_groups', []);
  const queue = getSyncQueue();
  let resultList = [...groups];

  for (const task of queue) {
    if (task.operation === 'ADD_PERSON_GROUP') resultList.push({ ...task.payload, isLocalUnsynced: true });
    else if (task.operation === 'UPDATE_PERSON_GROUP') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList[idx] = { ...resultList[idx], ...task.payload.group, isLocalUnsynced: true };
    }
    else if (task.operation === 'DELETE_PERSON_GROUP') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList.splice(idx, 1);
    }
  }
  return resultList.sort((a, b) => b.createdAt - a.createdAt);
};`;
code = code.replace(getGroupsMatch, getGroupsRepl);


const getRolesMatch = `export const getPersonRoles = async () => {
  const roles = await getLocalData<any[]>('person_roles', []);
  if (roles.length === 0) {
    // initialize defaults
    const defaults = [
      { id: 'customer', name: 'مشتری', code: '10', color: 'bg-emerald-50 text-emerald-800 border-emerald-100', createdAt: Date.now() },
      { id: 'supplier', name: 'تامین کننده', code: '20', color: 'bg-orange-50 text-orange-850 border-orange-100', createdAt: Date.now() },
      { id: 'employee', name: 'کارمند', code: '30', color: 'bg-purple-50 text-purple-800 border-purple-100', createdAt: Date.now() }
    ];
    await saveLocalData('person_roles', defaults);
    return defaults;
  }
  return roles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};`;
const getRolesRepl = `export const getPersonRoles = async () => {
  let roles = await getLocalData<any[]>('person_roles', []);
  if (roles.length === 0) {
    // initialize defaults
    const defaults = [
      { id: 'customer', name: 'مشتری', code: '10', color: 'bg-emerald-50 text-emerald-800 border-emerald-100', createdAt: Date.now() },
      { id: 'supplier', name: 'تامین کننده', code: '20', color: 'bg-orange-50 text-orange-850 border-orange-100', createdAt: Date.now() },
      { id: 'employee', name: 'کارمند', code: '30', color: 'bg-purple-50 text-purple-800 border-purple-100', createdAt: Date.now() }
    ];
    await saveLocalData('person_roles', defaults);
    roles = defaults;
  }
  
  const queue = getSyncQueue();
  let resultList = [...roles];

  for (const task of queue) {
    if (task.operation === 'ADD_PERSON_ROLE') resultList.push({ ...task.payload, isLocalUnsynced: true });
    else if (task.operation === 'UPDATE_PERSON_ROLE') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList[idx] = { ...resultList[idx], ...task.payload.role, isLocalUnsynced: true };
    }
    else if (task.operation === 'DELETE_PERSON_ROLE') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList.splice(idx, 1);
    }
  }

  return resultList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};`;
code = code.replace(getRolesMatch, getRolesRepl);


const getCatsMatch = `export const getPersonCategories = async () => {
  const categories = await getLocalData<any[]>('person_categories', []);
  return categories.sort((a, b) => b.createdAt - a.createdAt);
};`;
const getCatsRepl = `export const getPersonCategories = async () => {
  const categories = await getLocalData<any[]>('person_categories', []);
  const queue = getSyncQueue();
  let resultList = [...categories];

  for (const task of queue) {
    if (task.operation === 'ADD_PERSON_CATEGORY') resultList.push({ ...task.payload, isLocalUnsynced: true });
    else if (task.operation === 'UPDATE_PERSON_CATEGORY') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList[idx] = { ...resultList[idx], ...task.payload.category, isLocalUnsynced: true };
    }
    else if (task.operation === 'DELETE_PERSON_CATEGORY') {
       const idx = resultList.findIndex(p => p.id === task.payload.id || p.id === task.payload.originalId);
       if (idx !== -1) resultList.splice(idx, 1);
    }
  }

  return resultList.sort((a, b) => b.createdAt - a.createdAt);
};`;
code = code.replace(getCatsMatch, getCatsRepl);

fs.writeFileSync('src/services/personService.ts', code);
console.log('personService patched again');
