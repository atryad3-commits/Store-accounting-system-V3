const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Add loanNumber logic
const loanCreationOld = `    const loanId = Date.now().toString();

    const newLoan: Loan = {
      id: loanId,
      personId: formData.personId,
      amount: amountNum,`;
const loanCreationNew = `    const loanId = Date.now().toString();
    const loanNumber = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number

    const newLoan: Loan = {
      id: loanId,
      loanNumber,
      personId: formData.personId,
      amount: amountNum,`;
code = code.replace(loanCreationOld, loanCreationNew);

const instOld = `      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        loanId: loanId,
        dueDate: dueDateStr,
        amount: instAmount,
        status: 'pending',
      });`;
const instNew = `      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        installmentNumber: i + 1,
        loanId: loanId,
        dueDate: dueDateStr,
        amount: instAmount,
        status: 'pending',
      });`;
code = code.replace(instOld, instNew);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
