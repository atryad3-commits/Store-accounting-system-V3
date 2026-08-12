const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansDashboard.tsx', 'utf8');

code = code.replace(
    /formatCurrency = \(val: number\) => Number\(val\)\.toLocaleString\("fa-IR"\) \+ " تومان",/,
    'formatCurrency = (val: number) => Number(val).toLocaleString("fa-IR") + " " + (storeSettings?.currency || "تومان"),'
);

code = code.replace(
    /<p className="text-\[10px\] text-gray-500 mt-1">تومان<\/p>/,
    '<p className="text-[10px] text-gray-500 mt-1">{storeSettings?.currency || "تومان"}</p>'
);

fs.writeFileSync('src/components/loans/LoansDashboard.tsx', code);
