const fs = require('fs');
let code = fs.readFileSync('src/components/common/BackgroundSync.tsx', 'utf8');

const imports = `
import { 
  addPersonToServer, updatePersonToServer, deletePersonToServer,
  addPersonGroupToServer, updatePersonGroupToServer, deletePersonGroupToServer,
  addPersonRoleToServer, updatePersonRoleToServer, deletePersonRoleToServer,
  addPersonCategoryToServer, updatePersonCategoryToServer, deletePersonCategoryToServer
} from '../../services/personService';
`;
code = code.replace("import { addPersonToServer, updatePersonToServer, deletePersonToServer } from '../../services/personService';", imports);

const syncLogicMatch = `        if (task.operation === 'ADD_PERSON') {
          // Remove local flag before saving
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON') {
          await updatePersonToServer(task.payload.id, task.payload.person);
        } else if (task.operation === 'DELETE_PERSON') {
          await deletePersonToServer(task.payload.id);
        }`;

const syncLogicRepl = `        if (task.operation === 'ADD_PERSON') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON') {
          await updatePersonToServer(task.payload.id, task.payload.person);
        } else if (task.operation === 'DELETE_PERSON') {
          await deletePersonToServer(task.payload.id);
        } else if (task.operation === 'ADD_PERSON_GROUP') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonGroupToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON_GROUP') {
          await updatePersonGroupToServer(task.payload.id, task.payload.group);
        } else if (task.operation === 'DELETE_PERSON_GROUP') {
          await deletePersonGroupToServer(task.payload.id);
        } else if (task.operation === 'ADD_PERSON_ROLE') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonRoleToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON_ROLE') {
          await updatePersonRoleToServer(task.payload.id, task.payload.role);
        } else if (task.operation === 'DELETE_PERSON_ROLE') {
          await deletePersonRoleToServer(task.payload.id);
        } else if (task.operation === 'ADD_PERSON_CATEGORY') {
          const { isLocalUnsynced, ...payload } = task.payload;
          await addPersonCategoryToServer(payload);
        } else if (task.operation === 'UPDATE_PERSON_CATEGORY') {
          await updatePersonCategoryToServer(task.payload.id, task.payload.category);
        } else if (task.operation === 'DELETE_PERSON_CATEGORY') {
          await deletePersonCategoryToServer(task.payload.id);
        }`;

code = code.replace(syncLogicMatch, syncLogicRepl);
fs.writeFileSync('src/components/common/BackgroundSync.tsx', code);
console.log('BackgroundSync patched');
