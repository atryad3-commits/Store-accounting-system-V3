const fs = require('fs');
let code = fs.readFileSync('src/pages/loans/LoanCardPage.tsx', 'utf8');

code = code.replace(
    /formatCurrency=\{props\.formatCurrency \|\| \(\(v: number\) => Number\(v\)\.toLocaleString\(\)\)\}/g,
    `formatCurrency={props.formatCurrency || ((v: number) => Number(v).toLocaleString())}
          currency={props.storeSettings?.currency || 'تومان'}`
);

fs.writeFileSync('src/pages/loans/LoanCardPage.tsx', code);
