const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
/const transactionId = \`txn-loan-\$\{loanId\}\`;\n\s+const newTransaction = \{/,
`const transactionId = \`txn-loan-\${loanId}\`;
    const interestAmt = (instCount * instAmount) - amountNum;
    const newTransaction = {
      interestAmount: interestAmt > 0 ? interestAmt : 0,`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
