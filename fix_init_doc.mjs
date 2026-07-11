import fs from 'fs';
let content = fs.readFileSync('src/components/accounting/AccountingDocCreate.tsx', 'utf8');
content = content.replace(/initialDoc\?\.items\?\.length > 0/g, '(initialDoc?.items && initialDoc.items.length > 0)');
fs.writeFileSync('src/components/accounting/AccountingDocCreate.tsx', content);
