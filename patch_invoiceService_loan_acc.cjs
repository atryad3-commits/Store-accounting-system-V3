const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

const loanLogic = `
         if (transaction.categoryId === 'loan_given' || transaction.categoryId === 'loan_received') {
             const interestAmt = Number((transaction as any).interestAmount) || 0;
             const principal = Number(transaction.amount);
             const totalPayable = principal + interestAmt;
             
             if (transaction.categoryId === 'loan_given') {
                 items.push({
                     description: transaction.description ? transaction.description + \` - طرف حساب \${personName}\` : \`اعطای وام به \${personName}\`,
                     debit: totalPayable, credit: 0,
                     ledgerAccountId: personLedgerId, detailedAccountId: transaction.personId
                 });
                 items.push({
                     description: transaction.description ? transaction.description + \` - برداشت از \${resourceName}\` : \`پرداخت وجه بابت اعطای وام\`,
                     debit: 0, credit: principal,
                     ledgerAccountId: resourceLedgerId
                 });
                 if (interestAmt > 0) {
                     const interestAcc = ledgerAccounts.find((a: any) => a.title.includes('درآمد') && a.title.includes('بهره')) || ledgerAccounts.find((a: any) => String(a.code).startsWith('4')) || { id: defaultLedger };
                     items.push({
                         description: \`شناسایی درآمد بهره بابت وام شماره \${(newTransaction.id || '').replace('txn-loan-', '')}\`,
                         debit: 0, credit: interestAmt,
                         ledgerAccountId: interestAcc.id
                     });
                 }
             } else {
                 items.push({
                     description: transaction.description ? transaction.description + \` - واریز به \${resourceName}\` : \`دریافت وجه بابت وام دریافتی\`,
                     debit: principal, credit: 0,
                     ledgerAccountId: resourceLedgerId
                 });
                 if (interestAmt > 0) {
                     const expenseAcc = ledgerAccounts.find((a: any) => String(a.code) === '53' || String(a.code) === '5') || { id: defaultLedger };
                     items.push({
                         description: \`شناسایی هزینه بهره بابت وام دریافتی شماره \${(newTransaction.id || '').replace('txn-loan-', '')}\`,
                         debit: interestAmt, credit: 0,
                         ledgerAccountId: expenseAcc.id
                     });
                 }
                 items.push({
                     description: transaction.description ? transaction.description + \` - طرف حساب \${personName}\` : \`اخذ وام از \${personName}\`,
                     debit: 0, credit: totalPayable,
                     ledgerAccountId: personLedgerId, detailedAccountId: transaction.personId
                 });
             }
         } else if (transaction.type === 'receive') {
`;

code = code.replace(
/if \(transaction\.type === 'receive'\) \{/,
loanLogic.trim()
);

fs.writeFileSync('src/services/invoiceService.ts', code);
