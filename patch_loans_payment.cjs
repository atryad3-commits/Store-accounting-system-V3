const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansPayment.tsx', 'utf-8');

// Add initialLoanId?: string to Props
content = content.replace('storeSettings?: any;', 'storeSettings?: any;\n  initialLoanId?: string;');

// Add initialLoanId to component destructuring
content = content.replace('storeSettings }: Props) {', 'storeSettings, initialLoanId }: Props) {');

// Add a useEffect to load initialLoanId if present
const useEffectBlock = `
  useEffect(() => {
    if (initialLoanId) {
      const loan = loans.find(l => l.id.toString() === initialLoanId);
      if (loan) {
        setSelectedLoan(loan);
        setSearchQuery(loan.loanNumber || loan.id.toString());
      }
    }
  }, [initialLoanId, loans]);
`;

content = content.replace('useEffect(() => {\n    const fetchMethods', useEffectBlock + '\n  useEffect(() => {\n    const fetchMethods');

fs.writeFileSync('src/components/loans/LoansPayment.tsx', content);
