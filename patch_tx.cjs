const fs = require('fs');

const path = 'src/services/installmentPaymentService.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /for \(const alloc of preview\.allocations\) \{[\s\S]*?\/\/ Update Transaction & Accounting/m,
    `for (const alloc of preview.allocations) {
        const instIndex = updatedInstallments.findIndex(i => i.id === alloc.installmentId);
        if (instIndex !== -1) {
            const inst = updatedInstallments[instIndex];
            if (alloc.isPenalty) {
                totalAllocatedPenalty += alloc.amount;
                updatedInstallments[instIndex] = {
                    ...inst,
                    penaltyPaidAmount: (inst.penaltyPaidAmount || 0) + alloc.amount
                };
            } else {
                const newPaid = (inst.paidAmount || 0) + alloc.amount;
                // Important: an installment is fully paid only if the principal is paid AND there is no remaining accrued penalty
                const isPaid = newPaid >= inst.amount && (calculatePenalty(loan, inst) - (updatedInstallments[instIndex].penaltyPaidAmount || inst.penaltyPaidAmount || 0) <= 0);
                
                updatedInstallments[instIndex] = {
                    ...updatedInstallments[instIndex],
                    paidAmount: newPaid,
                    status: isPaid ? 'paid' : 'pending',
                    paidDate: isPaid ? todayIso : inst.paidDate
                };
                totalAllocatedPrincipal += alloc.amount;
            }
            
            // Re-check isPaid status for penalty allocations as well
            if (alloc.isPenalty) {
                const currentInst = updatedInstallments[instIndex];
                const isPaid = (currentInst.paidAmount || 0) >= currentInst.amount && (calculatePenalty(loan, currentInst) - (currentInst.penaltyPaidAmount || 0) <= 0);
                if (isPaid) {
                    updatedInstallments[instIndex].status = 'paid';
                    updatedInstallments[instIndex].paidDate = currentInst.paidDate || todayIso;
                }
            }
        }
    }
    
    // Update Transaction & Accounting`
);

code = code.replace(
    /const tx = await addTransaction\(\{[\s\S]*?isSystem: true,\s*\}\);/m,
    `// The main payment transaction
    const tx = await addTransaction({
        type: txType,
        amount: amountEntered, // Actual amount received
        method: paymentMethodType === 'account' ? 'account' : 'cash',
        resourceType: paymentMethodType === 'account' ? 'bank' : 'cashbox',
        resourceId: paymentMethodId,
        accountId: paymentMethodType === 'account' ? paymentMethodId : undefined,
        cashboxId: paymentMethodType === 'cashbox' ? paymentMethodId : undefined,
        personId: loan.personId,
        categoryId: loan.type === 'given' ? 'loan_installment_received' : 'loan_installment_paid',
        description: \`پرداخت قسط(ها) برای کد یکتا \${installmentCode}\`,
        date: new Date().toISOString().split('T')[0],
        jalaliDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
        time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
        isSystem: true,
    });
    
    // Also register the penalty charge in the ledger if there is any penalty paid
    if (totalAllocatedPenalty > 0) {
        await addTransaction({
            type: loan.type === 'given' ? 'pay' : 'receive', // The opposite type: charges the person
            amount: totalAllocatedPenalty,
            method: 'account', // Does not matter, but we must provide it
            resourceType: 'bank',
            resourceId: 'penalty-virtual',
            personId: loan.personId,
            categoryId: loan.type === 'given' ? 'loan_penalty_charged' : 'loan_penalty_deducted',
            description: \`ثبت جریمه دیرکرد قسط برای کد یکتا \${installmentCode}\`,
            date: new Date().toISOString().split('T')[0],
            jalaliDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
            time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
            isSystem: true,
        });
    }`
);

fs.writeFileSync(path, code);
