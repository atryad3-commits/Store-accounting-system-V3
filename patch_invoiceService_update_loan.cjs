const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

const loanLogicUpdate = `
         if (updated.categoryId === 'loan_given' || updated.categoryId === 'loan_received') {
             const interestAmt = Number((updated as any).interestAmount) || 0;
             const principal = Number(updated.amount);
             const totalPayable = principal + interestAmt;
             
             if (updated.categoryId === 'loan_given') {
                 items.push({
                     description: updated.description ? updated.description + \` - طرف حساب \${personName}\` : \`اعطای وام به \${personName}\`,
                     debit: totalPayable, credit: 0,
                     ledgerAccountId: personLedgerId, detailedAccountId: updated.personId
                 });
                 items.push({
                     description: updated.description ? updated.description + \` - برداشت از \${resourceName}\` : \`پرداخت وجه بابت اعطای وام\`,
                     debit: 0, credit: principal,
                     ledgerAccountId: resourceLedgerId
                 });
                 if (interestAmt > 0) {
                     const interestAcc = ledgerAccounts.find((a: any) => a.title.includes('درآمد') && a.title.includes('بهره')) || ledgerAccounts.find((a: any) => String(a.code).startsWith('4')) || { id: defaultLedger };
                     items.push({
                         description: \`شناسایی درآمد بهره بابت وام شماره \${(updated.id || '').replace('txn-loan-', '')}\`,
                         debit: 0, credit: interestAmt,
                         ledgerAccountId: interestAcc.id
                     });
                 }
             } else {
                 items.push({
                     description: updated.description ? updated.description + \` - واریز به \${resourceName}\` : \`دریافت وجه بابت وام دریافتی\`,
                     debit: principal, credit: 0,
                     ledgerAccountId: resourceLedgerId
                 });
                 if (interestAmt > 0) {
                     const expenseAcc = ledgerAccounts.find((a: any) => String(a.code) === '53' || String(a.code) === '5') || { id: defaultLedger };
                     items.push({
                         description: \`شناسایی هزینه بهره بابت وام دریافتی شماره \${(updated.id || '').replace('txn-loan-', '')}\`,
                         debit: interestAmt, credit: 0,
                         ledgerAccountId: expenseAcc.id
                     });
                 }
                 items.push({
                     description: updated.description ? updated.description + \` - طرف حساب \${personName}\` : \`اخذ وام از \${personName}\`,
                     debit: 0, credit: totalPayable,
                     ledgerAccountId: personLedgerId, detailedAccountId: updated.personId
                 });
             }
         } else if (updated.type === 'receive') {
`;

code = code.replace(
/if \(updated\.type === 'receive'\) \{/,
loanLogicUpdate.trim()
);

fs.writeFileSync('src/services/invoiceService.ts', code);
