import fs from 'fs';
let content = fs.readFileSync('src/components/invoices/InvoicesList.tsx', 'utf8');
content = content.replace(/\(group\.invoices\)\.map\(\(inv\) =>/g, '(group.invoices || []).map((inv, invIdx) =>');
content = content.replace(/key=\{inv\.id\}/g, 'key={inv.id ? `inv-${inv.id}` : `invIdx-${invIdx}`}');
fs.writeFileSync('src/components/invoices/InvoicesList.tsx', content);
