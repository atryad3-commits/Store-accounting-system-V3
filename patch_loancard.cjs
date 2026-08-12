const fs = require('fs');
let code = fs.readFileSync('src/pages/loans/LoanCardPage.tsx', 'utf8');

code = code.replace(/<InstallmentBookletPrint\s+loan=\{loan\}\s+installments=\{installments.filter\(i => String\(i.loanId\) === String\(loan.id\)\)\}\s+person=\{persons.find\(p => String\(p.id\) === String\(loan.personId\)\)\}\s+onClose=\{\(\) => setPrintingLoanId\(null\)\}\s+formatCurrency=\{props.formatCurrency \|\| \(\(v: number\) => Number\(v\).toLocaleString\(\)\)\}\s+\/>/, 
`<InstallmentBookletPrint
          loan={loan}
          installments={installments.filter(i => String(i.loanId) === String(loan.id))}
          person={persons.find(p => String(p.id) === String(loan.personId))}
          onClose={() => setPrintingLoanId(null)}
          formatCurrency={props.formatCurrency || ((v: number) => Number(v).toLocaleString())}
          currency={props.storeSettings?.currency || 'تومان'}
        />`);

fs.writeFileSync('src/pages/loans/LoanCardPage.tsx', code);
