import sys

file_path = 'src/components/loans/LoansManager.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        onPayInstallment={(loanId) => {
           setExpandedLoanId(null);
           setSelectedLoanForPayment(loanId);
           // navigate('/loans_payment');
           // the tab changes via activeTab if it's SPA, or just use selectedLoanForPayment 
        }}"""

replacement = """        onPayInstallment={(loanId) => {
           setExpandedLoanId(null);
           setSelectedLoanForPayment(loanId);
           navigate('/loans_payment');
        }}"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed navigate successfully")
else:
    print("Target not found")
