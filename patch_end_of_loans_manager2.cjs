const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

if (!code.includes('<InstallmentBookletPrint')) {
    code = code.replace(
        /<\/motion\.div>\s*\)\}\s*<\/div>\s*\);\s*\}/,
        `</motion.div>
      )}

        {printingLoanId && (
          <InstallmentBookletPrint
            loan={loans.find(l => l.id === printingLoanId)!}
            installments={installments.filter(i => i.loanId === printingLoanId)}
            person={persons.find(p => p.id === loans.find(l => l.id === printingLoanId)?.personId)}
            onClose={() => setPrintingLoanId(null)}
            formatCurrency={formatCurrency}
          />
        )}
    </div>
  );
}`
    );
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
