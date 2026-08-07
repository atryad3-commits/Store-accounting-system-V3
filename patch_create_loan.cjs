const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Update initial status to 'requested'
code = code.replace(
    /status: 'active',/g,
    "status: 'requested', // Initial status"
);

// Remove transaction creation from handleCreateLoan
code = code.replace(
    /const transactionId = `txn-loan-\$\{loanId\}`;[\s\S]*?const newInstsList = \[\.\.\.installments, \.\.\.newInstallments\];/m,
    "const newInstsList = [...installments, ...newInstallments];"
);

code = code.replace(
    /const addedTx = await addTransaction\(newTransaction as any\);\n\s*setTransactions\(\[\.\.\.transactions, addedTx\]\);\n\s*await saveLoans\(newLoansList\);/,
    "await saveLoans(newLoansList);"
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
