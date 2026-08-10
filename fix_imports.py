with open('src/pages/loans/LoanCardPage.tsx', 'r') as f:
    text = f.read()

text = text.replace("import { getLoans, getInstallments, getPersons } from '../../services/accountingService';", "import { getLoans, getInstallments } from '../../services/accountingService';\nimport { getPersons } from '../../services/personService';")

with open('src/pages/loans/LoanCardPage.tsx', 'w') as f:
    f.write(text)
