const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

if (!code.includes('printingLoanId')) {
    code = code.replace(
        "const [expandedLoanId, setExpandedLoanId] = useState<string | number | null>(null);",
        "const [expandedLoanId, setExpandedLoanId] = useState<string | number | null>(null);\n  const [printingLoanId, setPrintingLoanId] = useState<string | null>(null);"
    );
}

if (!code.includes('InstallmentBookletPrint')) {
    code = code.replace(
        "import LoansSettings from './LoansSettings';",
        "import LoansSettings from './LoansSettings';\nimport InstallmentBookletPrint from './InstallmentBookletPrint';\nimport { Printer } from 'lucide-react';"
    );
}

const target = `{(userRole === 'admin' || userRole === 'manager') && (
                               <button
                                 onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                                 className="mt-2 text-rose-500 hover:text-rose-700 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Trash2 className="w-4 h-4" />
                                  حذف وام
                               </button>
                             )}`;
                             
const replacement = `<div className="flex items-center gap-3 mt-2">
                              <button
                                 onClick={(e) => { e.stopPropagation(); setPrintingLoanId(loan.id as string); }}
                                 className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Printer className="w-4 h-4" />
                                  چاپ دفترچه
                               </button>
                              {(userRole === 'admin' || userRole === 'manager') && (
                               <button
                                 onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                                 className="text-rose-500 hover:text-rose-700 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Trash2 className="w-4 h-4" />
                                  حذف وام
                               </button>
                             )}
                            </div>`;

code = code.replaceAll(target, replacement);

if (!code.includes('<InstallmentBookletPrint')) {
    code = code.replace(
        /<\/div>\s*<\/div>\s*\)\s*\}$/,
        `
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
    </div>
  );
}`
    );
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
