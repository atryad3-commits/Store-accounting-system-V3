const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const modalCode = `
      {printingLoanId && (
        <InstallmentBookletPrint
          loan={loans.find(l => l.id === printingLoanId)!}
          installments={installments.filter(i => i.loanId === printingLoanId)}
          person={persons.find(p => p.id === (loans.find(l => l.id === printingLoanId)?.personId))}
          onClose={() => setPrintingLoanId(null)}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}`;

code = code.replace(/    <\/div>\s*<\/div>\s*\);\s*\}$/m, modalCode);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
