const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf8');
code = code.replace(/export const getChecksSummary[\s\S]*/, '');
fs.writeFileSync('src/services/dataService.ts', code);
