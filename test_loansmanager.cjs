const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');
console.log(code.match(/startDate:/g)?.length);
console.log(code.includes('requestDate'));
