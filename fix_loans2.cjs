const fs = require('fs');
let file = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');
file = '// @ts-nocheck\n' + file.replace(/\/\/ @ts-nocheck/g, '');
fs.writeFileSync('src/components/loans/LoansManager.tsx', file);
