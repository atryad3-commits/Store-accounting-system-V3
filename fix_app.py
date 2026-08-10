with open('src/App.tsx', 'r') as f:
    text = f.read()

import_statement = "import LoanCardPage from './pages/loans/LoanCardPage';\n"
if "import LoanCardPage" not in text:
    text = text.replace("import MinimalMobilePersonModal from \"./components/modals/MinimalMobilePersonModal\";", import_statement + "import MinimalMobilePersonModal from \"./components/modals/MinimalMobilePersonModal\";")

route = "<Route path=\"/loan/:id\" element={<LoanCardPage showNotification={showNotification} userRole={user?.role} formatCurrency={formatCurrency} />} />"
if "<Route path=\"/loan/:id\"" not in text:
    text = text.replace("<Route path=\"/loans_dashboard\"", route + "\n<Route path=\"/loans_dashboard\"")

with open('src/App.tsx', 'w') as f:
    f.write(text)
