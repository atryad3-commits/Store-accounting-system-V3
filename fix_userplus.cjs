const fs = require('fs');

const files = [
  'src/components/invoices/PurchaseInvoiceCreate.tsx',
  'src/components/invoices/PurchaseReturnInvoiceCreate.tsx',
  'src/components/invoices/SaleInvoiceCreate.tsx',
  'src/components/invoices/SaleReturnInvoiceCreate.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  if (code.includes('<UserPlus') && !code.includes('UserPlus') || !code.includes('UserPlus,') && code.includes('lucide-react')) {
    code = code.replace(/import\s*\{([^}]*)\}\s*from\s*'lucide-react';/, (match, p1) => {
      if (!p1.includes('UserPlus')) {
        return `import { ${p1}, UserPlus } from 'lucide-react';`;
      }
      return match;
    });
    fs.writeFileSync(file, code, 'utf-8');
    console.log('Fixed UserPlus in', file);
  }
});
