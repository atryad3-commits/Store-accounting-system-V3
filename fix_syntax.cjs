const fs = require('fs');

const path = 'src/services/installmentPaymentService.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    `if (principalToPay > 0) {
        allocations.push({ installmentId: installment.id, amount: principalToPay, isPenalty: false });
    });
    }`,
    `if (principalToPay > 0) {
        allocations.push({ installmentId: installment.id, amount: principalToPay, isPenalty: false });
    }`
);

fs.writeFileSync(path, code);
