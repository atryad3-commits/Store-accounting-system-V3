import fs from 'fs';
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');
code = code.replace(/installments\.filter/g, '(installments || []).filter');
fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
