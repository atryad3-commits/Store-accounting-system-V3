import re
with open('src/components/loans/LoansManager.tsx', 'r') as f:
    text = f.read()

text = text.replace("&& expandedLoanId === null", "")

with open('src/components/loans/LoansManager.tsx', 'w') as f:
    f.write(text)
