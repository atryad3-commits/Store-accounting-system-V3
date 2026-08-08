const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
content = content.replace(/amount: selectedPersonBalance\.amount,\s*type: selectedPersonBalance\.value > 0 \? 'given' : 'received'\s*\);/g, "amount: selectedPersonBalance.amount,\n                                     type: selectedPersonBalance.value > 0 ? 'given' : 'received'\n                                  });");
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
