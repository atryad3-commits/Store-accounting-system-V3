const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(/  await appendLocalData\('check_history', newItem\);\n  return newItem;\n};\n/g, "");

fs.writeFileSync('src/services/accountingService.ts', file);
