const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

// Replace the bad logic with `if (transaction.type === 'receive') {`
code = code.replace(
/if \(transaction\.categoryId === 'loan_given' \|\| transaction\.categoryId === 'loan_received'\) \{[\s\S]*?\} else if \(transaction\.type === 'receive'\) \{/m,
`if (transaction.type === 'receive') {`
);

code = code.replace(
/if \(updated\.categoryId === 'loan_given' \|\| updated\.categoryId === 'loan_received'\) \{[\s\S]*?\} else if \(updated\.type === 'receive'\) \{/m,
`if (updated.type === 'receive') {`
);

fs.writeFileSync('src/services/invoiceService.ts', code);
