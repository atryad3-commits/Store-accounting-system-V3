import fs from 'fs';
let code = fs.readFileSync('src/components/modals/PersonIOModal.tsx', 'utf8');
code = code.replace(/persons\.length/g, '(persons || []).length');
code = code.replace(/parsedHeaders\.length/g, '(parsedHeaders || []).length');
code = code.replace(/row\.length/g, '(row || []).length');
code = code.replace(/parsedRows\.length/g, '(parsedRows || []).length');
fs.writeFileSync('src/components/modals/PersonIOModal.tsx', code);
