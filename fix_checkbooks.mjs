import fs from 'fs';
let code = fs.readFileSync('src/components/financial/CheckbooksManager.tsx', 'utf8');
code = code.replace(/checkbooks\.length/g, '(checkbooks || []).length');
fs.writeFileSync('src/components/financial/CheckbooksManager.tsx', code);
