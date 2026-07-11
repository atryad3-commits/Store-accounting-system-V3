import fs from 'fs';
const files = [
  'src/components/persons/PersonsManager.tsx',
  'src/components/products/ProductsTab.tsx',
  'src/components/accounting/AccountingDocView.tsx',
  'src/App.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/key=\{([a-zA-Z0-9_\.]+) \|\| index\}/g, 'key={$1 ? `id-${$1}` : `idx-${index}`}');
  fs.writeFileSync(file, code);
});
