import fs from 'fs';
let content = fs.readFileSync('src/components/invoices/InvoicesList.tsx', 'utf8');
content = content.replace(/key=\{inv\.id \? \`inv-\$\{inv\.id\}\` : \`invIdx-\$\{invIdx\}\`\}/g, 'key={inv.id ? `inv-${inv.id}-${invIdx}` : `invIdx-${invIdx}`}');
fs.writeFileSync('src/components/invoices/InvoicesList.tsx', content);
