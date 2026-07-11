import fs from 'fs';
let code = fs.readFileSync('src/services/dataService.ts', 'utf8');
code = code.replace(/accounts\.length/g, '(accounts || []).length');
code = code.replace(/cashboxes\.length/g, '(cashboxes || []).length');
code = code.replace(/categories\.length/g, '(categories || []).length');
fs.writeFileSync('src/services/dataService.ts', code);
