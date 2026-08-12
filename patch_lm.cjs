const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /<LoansArrears formatCurrency=\{formatCurrency\} loans=\{finalApprovedLoans\} installments=\{installments\} persons=\{persons\} \/>/g,
    `<LoansArrears formatCurrency={formatCurrency} loans={finalApprovedLoans} installments={installments} persons={persons} storeSettings={storeSettings} />`
);

code = code.replace(
    /onClose=\{.*?\}\s+formatCurrency=\{formatCurrency\}\s+\/>/g,
    match => match.replace("/>", `currency={storeSettings?.currency || 'تومان'} />`)
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
