const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /status: 'requested', \/\/ Initial status\n\s*type: formData\.type,/,
    "status: 'requested', // Initial status\n      type: formData.type,\n      accountId: formData.accountId,"
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
