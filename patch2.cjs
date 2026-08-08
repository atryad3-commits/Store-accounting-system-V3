const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const modals = `
      {statusModalLoanId && (
        <LoanStatusModal
          isOpen={true}
          onClose={() => setStatusModalLoanId(null)}
          loan={loans.find(l => l.id === statusModalLoanId) as Loan}
          onUpdateStatus={async (id, newStatus) => {
             await handleUpdateLoanStatus(id, newStatus);
             setStatusModalLoanId(null);
          }}
        />
      )}
      {printingLoanId && (
         <InstallmentBookletPrint
           loan={loans.find(l => l.id === printingLoanId) as Loan}
           installments={(installments || []).filter(i => i.loanId === printingLoanId)}
           person={persons.find(p => p.id === loans.find(l => l.id === printingLoanId)?.personId)}
           onClose={() => setPrintingLoanId(null)}
           formatCurrency={formatCurrency}
         />
      )}
    </div>
  );
}
`;

content = content.replace(/    <\/div>\n  \);\n}\s*$/, modals);

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
