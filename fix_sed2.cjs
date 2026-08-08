const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
content = content.replace(/                                    \)\n  ;/g, '                                    });');
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
