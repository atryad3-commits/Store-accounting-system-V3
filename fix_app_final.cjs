const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<InvoiceAllocation', '<InvoiceAllocation formatCurrency={formatCurrency}');
code = code.replace('<CalculatorModal formatCurrency={formatCurrency} ', '<CalculatorModal ');

fs.writeFileSync('src/App.tsx', code);
