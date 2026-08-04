const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(/return;\n\/\/ old code starts here:\n  const data = /g, 'return;\n// old code starts here:\n  // const data = ');
file = file.replace(/return;\n\/\/ old code starts here:\n  \/\/ const data = await getLocalData<any\[\]>\('issued_checks', \[\]\);\n  const index = /g, 'return;\n// old code starts here:\n  // const data = await getLocalData<any[]>(\'issued_checks\', []);\n  // const index = ');
file = file.replace(/return;\n\/\/ old code starts here:\n  \/\/ const data = await getLocalData<any\[\]>\('received_checks', \[\]\);\n  const index = /g, 'return;\n// old code starts here:\n  // const data = await getLocalData<any[]>(\'received_checks\', []);\n  // const index = ');

fs.writeFileSync('src/services/accountingService.ts', file);
