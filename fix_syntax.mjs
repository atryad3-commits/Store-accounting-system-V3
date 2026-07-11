import fs from 'fs';
const files = [
  'src/components/persons/PersonLedger.tsx',
  'src/components/admin/SystemChecklist.tsx',
  'src/components/accounting/AccountingVerification.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.\(items \|\| \[\]\)/g, '.items');
  fs.writeFileSync(file, content);
});
