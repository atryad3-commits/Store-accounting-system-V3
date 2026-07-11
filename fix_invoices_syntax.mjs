import fs from 'fs';
const files = [
  'src/components/invoices/InvoicesList.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.\(invoices \|\| \[\]\)/g, '.invoices');
  fs.writeFileSync(file, content);
});
