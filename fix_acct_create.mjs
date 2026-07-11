import fs from 'fs';
let code = fs.readFileSync('src/components/accounting/AccountingDocCreate.tsx', 'utf8');
code = code.replace(/items\.length/g, '(items || []).length');
fs.writeFileSync('src/components/accounting/AccountingDocCreate.tsx', code);
