const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansArrears.tsx', 'utf8');

code = code.replace(
    /if \(i\.dueDate >= today\) return false;/,
    'if (calculateDaysPastDue(i.dueDate) <= 0) return false;'
);

fs.writeFileSync('src/components/loans/LoansArrears.tsx', code);
