const fs = require('fs');
let code = fs.readFileSync('src/components/accounting/YearClosingChecklistModal.tsx', 'utf-8');
code = code.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/accounting/YearClosingChecklistModal.tsx', code, 'utf-8');
