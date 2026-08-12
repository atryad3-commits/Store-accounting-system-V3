const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.split("new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-')").join("new Date().toISOString()");

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
