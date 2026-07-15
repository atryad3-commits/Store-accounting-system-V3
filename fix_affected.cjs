const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const regex1 = /const affectedProducts = new Set<string>\(\);\n\s*if \(newInvoice\.items && Array\.isArray\(newInvoice\.items\)\) \{\n\s*const affectedProducts = new Set<string>\(\);/;
const replace1 = `const affectedProducts = new Set<string>();
          if (newInvoice.items && Array.isArray(newInvoice.items)) {`;
          
code = code.replace(regex1, replace1);

const regex2 = /if \(newInvoice\.items && Array\.isArray\(newInvoice\.items\)\) \{\n\s*const affectedProducts = new Set<string>\(\);/;
const replace2 = `const affectedProducts = new Set<string>();
          if (newInvoice.items && Array.isArray(newInvoice.items)) {`;

code = code.replace(regex2, replace2);

fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Fixed affectedProducts scope');
