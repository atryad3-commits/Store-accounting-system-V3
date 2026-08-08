const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
const lines = content.split('\n');
console.log(lines[717]);
lines[717] = "                                  });";
fs.writeFileSync('src/components/loans/LoansManager.tsx', lines.join('\n'));
