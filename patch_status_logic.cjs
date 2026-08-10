const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

// We'll update the handleUpdateLoanStatus to check valid transitions.
const handleUpdateFunc = /const handleUpdateLoanStatus = async \(loanId: string \| number, newStatus: string\) => \{[\s\S]*?setIsSubmitting\(false\);\n  \};/;

const newHandleUpdateFunc = `const handleUpdateLoanStatus = async (loanId: string | number, newStatus: string) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی تغییر وضعیت وام را ندارید.', 'error');
      return;
    }
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    if (loan.status === newStatus) return;
    
    // Valid transitions
    const validTransitions: Record<string, string[]> = {
      requested: ['incomplete', 'completed_dossier'],
      incomplete: ['completed_dossier'],
      completed_dossier: ['incomplete', 'approved'],
      approved: ['active'],
      active: ['completed'],
      overdue: ['completed', 'active'],
      completed: [] // No coming back from completed
    };
    
    if (!validTransitions[loan.status]?.includes(newStatus) && userRole !== 'admin') {
      showNotification('این تغییر وضعیت مجاز نیست.', 'error');
      return;
    }

    if (newStatus === 'completed') {
       // Check if all installments are paid
       const loanInsts = installments.filter(i => i.loanId === loanId);
       const unpaid = loanInsts.filter(i => i.status !== 'paid');
       if (unpaid.length > 0) {
          showNotification('برای تسویه وام باید تمامی اقساط پرداخت شده باشند.', 'error');
          return;
       }
    }

    startAppProcessing('شروع فرآیند تغییر وضعیت وام...');
    setIsSubmitting(true);

    let txCreated = false;
    let newTransactionsList = [...transactions];

    if (newStatus === 'active' && loan.status !== 'active') {
        // Generate transaction
        const transactionId = \`txn-loan-\${loan.id}\`;
        
        // check if transaction already exists
        if (!transactions.find(tx => tx.id === transactionId)) {
            const interestAmt = (loan.totalInstallments * loan.installmentAmount) - loan.amount;
            const newTransaction = {
                interestAmount: interestAmt > 0 ? interestAmt : 0,
                id: transactionId,
                type: loan.type === 'given' ? 'pay' : 'receive',
                amount: loan.amount,
                accountId: loan.accountId || '', // Fallback if missing
                personId: loan.personId,
                categoryId: loan.type === 'given' ? 'loan_given' : 'loan_received',
                description: loan.type === 'given' ? \`اعطای وام پرداختی شماره \${loan.loanNumber || loan.id}\` : \`اخذ وام دریافتی شماره \${loan.loanNumber || loan.id}\`,
                date: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
                documentNumber: \`LOAN-\${loan.loanNumber || loan.id}\`,
                createdAt: new Date().toISOString()
            };
            newTransactionsList.push(newTransaction);
            txCreated = true;
        }
    }

    const updatedLoans = loans.map(l => l.id === loanId ? { ...l, status: newStatus } : l);
    setLoans(updatedLoans);

    try {
        await saveLoans(updatedLoans);
        if (txCreated) {
           await addTransaction(newTransactionsList[newTransactionsList.length - 1]);
           setTransactions(newTransactionsList);
        }
        if (typeof addSystemLog !== 'undefined') {
            await addSystemLog('UPDATE_LOAN_STATUS', \`تغییر وضعیت وام \${loan.loanNumber || loan.id} به \${newStatus}\`, 'Loan', loan.id);
        }
        showNotification('وضعیت وام با موفقیت به‌روزرسانی شد.', 'success');
    } catch (err: any) {
        setLoans(loans); // rollback
        showNotification(err.message || 'خطا در تغییر وضعیت وام', 'error');
    }
    setIsSubmitting(false);
    stopAppProcessing();
  };`;
content = content.replace(handleUpdateFunc, newHandleUpdateFunc);
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
