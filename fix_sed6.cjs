const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
const lines = content.split('\n');
lines[728] = "                  )}";
fs.writeFileSync('src/components/loans/LoansManager.tsx', lines.join('\n'));
