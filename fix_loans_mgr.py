import re
with open('src/components/loans/LoansManager.tsx', 'r') as f:
    text = f.read()

text = re.sub(r'setExpandedLoanId\(isExpanded \? null : loan\.id\)', r'navigate(\'/loan/\' + loan.id)', text)
text = re.sub(r'setExpandedLoanId\(loan\.id\)', r'navigate(\'/loan/\' + loan.id)', text)

with open('src/components/loans/LoansManager.tsx', 'w') as f:
    f.write(text)
