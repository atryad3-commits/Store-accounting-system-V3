const fs = require('fs');

const path = 'src/services/installmentPaymentService.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace lookupInstallmentByCode
code = code.replace(
    /amountRemaining: inst\.amount - \(inst\.paidAmount \|\| 0\),/g,
    `amountRemaining: inst.amount - (inst.paidAmount || 0),
        penaltyPaidAmount: inst.penaltyPaidAmount || 0,`
);

// Replace calculatePaymentPreview logic
code = code.replace(
    /const penaltyAmount = calculatePenalty\(loan, installment\);[\s\S]*?const allocations.*? = \[\];/m,
    `const totalAccruedPenalty = calculatePenalty(loan, installment);
    const penaltyAmount = Math.max(0, totalAccruedPenalty - (installment.penaltyPaidAmount || 0));
    
    const totalDueForThisInst = amountRemaining + penaltyAmount;
    
    const isFullPayment = amountEntered === totalDueForThisInst;
    const isOverpayment = amountEntered > totalDueForThisInst;
    const isPartial = amountEntered < totalDueForThisInst;
    
    const overpaymentAmount = isOverpayment ? amountEntered - totalDueForThisInst : 0;
    
    const allocations: { installmentId: string | number; amount: number; isPenalty: boolean }[] = [];`
);

// Replace penalty allocation logic
code = code.replace(
    /if \(penaltyAmount > 0\) \{[\s\S]*?if \(principalToPay > 0\) \{[\s\S]*?\}/m,
    `const allocatedPenalty = Math.min(amountEntered, penaltyAmount);
    if (allocatedPenalty > 0) {
        allocations.push({ installmentId: installment.id, amount: allocatedPenalty, isPenalty: true });
    }
    
    const principalToPay = Math.min(Math.max(0, amountEntered - allocatedPenalty), amountRemaining);
    if (principalToPay > 0) {
        allocations.push({ installmentId: installment.id, amount: principalToPay, isPenalty: false });
    }`
);

fs.writeFileSync(path, code);
