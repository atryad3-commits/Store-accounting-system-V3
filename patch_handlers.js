const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Amount onChange
content = content.replace(
    /let r = formData\.interestRate === '' \? 0 : Number\(formData\.interestRate\);[\s\S]*?instAmt = Math\.round\(amt \/ instCount\) as any;\s*\}/g,
    "instAmt = calculateInstAmount(amt, instCount, formData.interestRate, formData.frequency, formData.roundingMultiple);"
);

fs.writeFileSync(file, content);
