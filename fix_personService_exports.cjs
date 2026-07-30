const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf8');

// The exported functions will just be available via `export * from './personService';`
