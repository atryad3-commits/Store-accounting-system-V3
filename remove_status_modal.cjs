const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

content = content.replace(/const \[statusModalLoanId, setStatusModalLoanId\] = useState<string \| null>\(null\);\n/, '');

const modalRegex = /\{statusModalLoanId && \([\s\S]*?<\/LoanStatusModal>\s*\n\s*\)\}/;
content = content.replace(modalRegex, '');

// also remove LoanStatusModal import
content = content.replace(/import LoanStatusModal from '\.\/LoanStatusModal';\n/, '');

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
