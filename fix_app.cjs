const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<PersonProfileView ', '<PersonProfileView formatCurrency={formatCurrency} ');
code = code.replace('<OrderList ', '<OrderList formatCurrency={formatCurrency} ');
code = code.replace('<CalculatorModal ', '<CalculatorModal formatCurrency={formatCurrency} ');

fs.writeFileSync('src/App.tsx', code);
