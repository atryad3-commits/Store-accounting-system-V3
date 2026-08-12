const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

code = code.replace(
    /const hasPaid = loanInsts\.some\(i => i\.status === 'paid'\);/,
    `const hasPaid = loanInsts.some(i => i.status === 'paid' || (i.paidAmount && i.paidAmount > 0) || i.receiptId);`
);

code = code.replace(
    /result\.sideEffects\.push\('حذف تراکنش ثبت شده صندوق\/بانک'\);/,
    `result.sideEffects.push('صدور تراکنش برگشتی (واریز) به صندوق/بانک');`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
