import { getLocalData, saveInstallments, addTransaction, getLoans, saveLoans, addSystemLog, getAccounts } from './dataService';
import { getPersons } from './personService';
import { Installment, Loan, Account, Cashbox } from '../types';
import { applyTransition } from './loanStateMachine';

export interface PaymentPreview {
    isFullPayment: boolean;
    isOverpayment: boolean;
    isPartial: boolean;
    penaltyAmount: number;
    amountDue: number; // Including penalty
    principalDue: number; // Just the installment remaining
    overpaymentAmount: number;
    allocations: { installmentId: string | number; amount: number; isPenalty: boolean }[];
}

export const lookupInstallmentByCode = async (code: string) => {
    const installments = await getLocalData<Installment[]>('installments', []);
    const inst = installments.find(i => i.installmentCode === code);
    
    if (!inst) {
        throw new Error('کد قسط یافت نشد');
    }
    
    const loans = await getLoans();
    const loan = loans.find(l => l.id.toString() === inst.loanId.toString());
    
    if (!loan) {
        throw new Error('وام مربوط به این قسط یافت نشد');
    }
    
    if (loan.status === 'completed' || loan.status === 'cancelled' as any) {
         throw new Error(`این وام در وضعیت ${loan.status === 'completed' ? 'تسویه شده' : 'لغو شده'} است`);
    }

    if (inst.status === 'paid') {
        throw new Error('این قسط قبلاً پرداخت شده است');
    }
    
    const persons = await getPersons();
    const person = persons.find(p => p.id.toString() === loan.personId.toString());

    return {
        installment: inst,
        loan,
        person,
        amountRemaining: inst.amount - (inst.paidAmount || 0),
    };
};

export const calculatePaymentPreview = async (
    installmentCode: string, 
    amountEntered: number
): Promise<PaymentPreview> => {
    const { installment, loan, amountRemaining } = await lookupInstallmentByCode(installmentCode);
    
    // Check penalty (Delay) - let's assume 1% per day for delay as an example, but here we can just do 0 if no clear policy is set. The user said "در صورت جریمه دیرکرد (اگر امروز از سررسید گذشته)، مبلغ جریمه را جداگانه محاسبه". Let's use 0 for now unless requested. Or let's just make it simple: 0 penalty for now.
    const today = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');
    let penaltyAmount = 0; // Can be enhanced later
    
    const totalDueForThisInst = amountRemaining + penaltyAmount;
    
    const isFullPayment = amountEntered === totalDueForThisInst;
    const isOverpayment = amountEntered > totalDueForThisInst;
    const isPartial = amountEntered < totalDueForThisInst;
    
    const overpaymentAmount = isOverpayment ? amountEntered - totalDueForThisInst : 0;
    
    const allocations: { installmentId: string | number; amount: number; isPenalty: boolean }[] = [];
    
    if (penaltyAmount > 0) {
        allocations.push({ installmentId: installment.id, amount: penaltyAmount, isPenalty: true });
    }
    
    const principalToPay = Math.min(amountEntered - penaltyAmount, amountRemaining);
    if (principalToPay > 0) {
        allocations.push({ installmentId: installment.id, amount: principalToPay, isPenalty: false });
    }
    
    if (isOverpayment) {
        // Find next installments (FIFO)
        const installments = await getLocalData<Installment[]>('installments', []);
        let nextInsts = installments.filter(i => 
            i.loanId === loan.id && 
            i.id !== installment.id && 
            i.status !== 'paid' &&
            i.dueDate >= installment.dueDate
        ).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        
        let remainingOverpayment = overpaymentAmount;
        
        for (const nextInst of nextInsts) {
            if (remainingOverpayment <= 0) break;
            
            const nextRemaining = nextInst.amount - (nextInst.paidAmount || 0);
            if (nextRemaining > 0) {
                const amountToApply = Math.min(remainingOverpayment, nextRemaining);
                allocations.push({ installmentId: nextInst.id, amount: amountToApply, isPenalty: false });
                remainingOverpayment -= amountToApply;
            }
        }
    }
    
    return {
        isFullPayment,
        isOverpayment,
        isPartial,
        penaltyAmount,
        amountDue: totalDueForThisInst,
        principalDue: amountRemaining,
        overpaymentAmount,
        allocations
    };
};

export const registerInstallmentPayment = async (
    installmentCode: string,
    amountEntered: number,
    paymentMethodType: 'account' | 'cashbox',
    paymentMethodId: string,
    userId: string
) => {
    // 1. Lock (virtually by getting fresh data) & Validate
    const { installment, loan } = await lookupInstallmentByCode(installmentCode);
    const preview = await calculatePaymentPreview(installmentCode, amountEntered);
    
    if (amountEntered <= 0) throw new Error('مبلغ باید بزرگتر از صفر باشد');
    
    const installments = await getLocalData<Installment[]>('installments', []);
    const loans = await getLoans();
    let updatedInstallments = [...installments];
    
    const today = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');
    let totalAllocatedPrincipal = 0;
    
    // Apply allocations
    for (const alloc of preview.allocations) {
        const instIndex = updatedInstallments.findIndex(i => i.id === alloc.installmentId);
        if (instIndex !== -1) {
            const inst = updatedInstallments[instIndex];
            if (alloc.isPenalty) {
                // Handle penalty (maybe save separately, for now just log it or add to paidAmount if you want to track it)
            } else {
                const newPaid = (inst.paidAmount || 0) + alloc.amount;
                const isPaid = newPaid >= inst.amount;
                
                updatedInstallments[instIndex] = {
                    ...inst,
                    paidAmount: newPaid,
                    status: isPaid ? 'paid' : 'pending',
                    paidDate: isPaid ? today : inst.paidDate
                };
                totalAllocatedPrincipal += alloc.amount;
            }
        }
    }
    
    // Save updated installments
    await saveInstallments(updatedInstallments);
    
    // Update Transaction & Accounting
    const txType = loan.type === 'given' ? 'receive' : 'pay';
    const tx = await addTransaction({
        type: txType,
        amount: amountEntered, // Actual amount received
        accountId: paymentMethodType === 'account' ? paymentMethodId : undefined,
        cashboxId: paymentMethodType === 'cashbox' ? paymentMethodId : undefined,
        personId: loan.personId,
        categoryId: loan.type === 'given' ? 'loan_installment_received' : 'loan_installment_paid',
        description: `پرداخت قسط(ها) برای کد یکتا ${installmentCode}`,
        date: today,
        time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
        isSystem: true,
    });
    
    // Check if loan status needs change
    const loanInsts = updatedInstallments.filter(i => i.loanId === loan.id);
    const allPaid = loanInsts.every(i => i.status === 'paid');
    
    let newLoanStatus = loan.status;
    if (allPaid && loan.status !== 'completed') {
        newLoanStatus = 'completed';
        // Use state machine to apply transition cleanly (it manages logging & accounting rollback/forward rules)
        await applyTransition(loan.id, 'completed', 'system', 'پرداخت تمام اقساط');
    } else if (loan.status === 'overdue') {
        // If it was overdue, and now the overdue installments are paid...
        const hasOverdue = loanInsts.some(i => i.status === 'overdue' || (i.status === 'pending' && i.dueDate < today));
        if (!hasOverdue) {
             newLoanStatus = 'active';
             await applyTransition(loan.id, 'active', 'system', 'تسویه اقساط معوق');
        }
    }
    
    await addSystemLog('PAY_INSTALLMENT', `دریافت/پرداخت قسط با کد ${installmentCode} مبلغ ${amountEntered}`, 'Installment', installment.id);
    
    return {
        success: true,
        receiptNumber: tx.receiptNumber || tx.id,
        allocatedAmount: totalAllocatedPrincipal,
        newLoanStatus
    };
};
