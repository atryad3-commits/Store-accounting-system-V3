const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace("accountId?: string | number; };", "accountId?: string | number; loanNumber?: string; };");
code = code.replace("paidAmount?: number; description?: string; };", "paidAmount?: number; description?: string; installmentNumber?: number; };");
fs.writeFileSync('src/types.ts', code);
