const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const printRegex = /<InstallmentBookletPrint[\s\S]*?\/>/;
const newPrint = `<InstallmentBookletPrint 
          loan={printingLoanId === 'preview' && previewData ? previewData.loan : loans.find(l => l.id === printingLoanId) as Loan} 
          installments={printingLoanId === 'preview' && previewData ? previewData.installments : (installments || []).filter(i => i.loanId === printingLoanId)} 
          person={persons.find(p => p.id === (printingLoanId === 'preview' && previewData ? previewData.loan.personId : loans.find(l => l.id === printingLoanId)?.personId))} 
          onClose={() => setPrintingLoanId(null)} 
          formatCurrency={formatCurrency} 
        />`;

content = content.replace(printRegex, newPrint);

// And update the button inside preview to set 'preview'
content = content.replace(/setPrintingLoanId\(previewData\.loan\.id\)/g, "setPrintingLoanId('preview')");

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
