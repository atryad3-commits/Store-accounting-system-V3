const fs = require('fs');
let code = fs.readFileSync('src/services/syncQueueService.ts', 'utf8');

code = code.replace(
  "export type SyncOperation = 'ADD_PERSON' | 'UPDATE_PERSON' | 'DELETE_PERSON';",
  "export type SyncOperation = 'ADD_PERSON' | 'UPDATE_PERSON' | 'DELETE_PERSON' | 'ADD_PERSON_GROUP' | 'UPDATE_PERSON_GROUP' | 'DELETE_PERSON_GROUP' | 'ADD_PERSON_ROLE' | 'UPDATE_PERSON_ROLE' | 'DELETE_PERSON_ROLE' | 'ADD_PERSON_CATEGORY' | 'UPDATE_PERSON_CATEGORY' | 'DELETE_PERSON_CATEGORY';"
);

fs.writeFileSync('src/services/syncQueueService.ts', code);
console.log('patched SyncOperation');
