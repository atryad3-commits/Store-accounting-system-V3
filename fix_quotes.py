with open('src/components/loans/LoansManager.tsx', 'r') as f:
    text = f.read()

text = text.replace("navigate(\\'/loan/\\' + loan.id)", "navigate('/loan/' + loan.id)")

with open('src/components/loans/LoansManager.tsx', 'w') as f:
    f.write(text)
