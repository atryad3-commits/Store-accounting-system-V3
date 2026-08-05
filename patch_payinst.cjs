const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const targetCheck = `    if(!paymentForm.installmentId || paymentForm.amount === '' || !paymentForm.accountId) {
       showNotification('اطلاعات پرداخت ناقص است.', 'error');
       return;
    }`;

const newCheck = `    if(!paymentForm.installmentId || paymentForm.amount === '' || !paymentForm.accountId) {
       showNotification('اطلاعات پرداخت ناقص است.', 'error');
       return;
    }
    const amountNum = Number(paymentForm.amount);
    if (amountNum <= 0) {
       showNotification('مبلغ پرداخت باید بیشتر از صفر باشد.', 'error');
       return;
    }`;

code = code.replace(targetCheck, newCheck);
// wait, the amountNum is already parsed further down.
code = code.replace("    const amountNum = Number(paymentForm.amount);\n", "");

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
