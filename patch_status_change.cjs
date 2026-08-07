const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const updateStatusFn = `
  const handleUpdateLoanStatus = async (loanId: string | number, newStatus: string) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی تغییر وضعیت وام را ندارید.', 'error');
      return;
    }
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    if (loan.status === newStatus) return;

    startAppProcessing('شروع فرآیند تغییر وضعیت وام...');
    setIsSubmitting(true);

    let txCreated = false;
    let newTransactionsList = [...transactions];

    if (newStatus === 'active' && loan.status !== 'active') {
        // Generate transaction
        const transactionId = \`txn-loan-\$\{loan.id\}\`;
        
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
                description: loan.type === 'given' ? \`اعطای وام پرداختی شماره \$\{loan.id\}\` : \`اخذ وام دریافتی شماره \$\{loan.id\}\`,
                date: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
                time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
                isSystem: true,
            };

            try {
                const addedTx = await addTransaction(newTransaction as any);
                newTransactionsList = [...transactions, addedTx];
                txCreated = true;
            } catch (err: any) {
                showNotification(err.message || 'خطا در ثبت سند حسابداری', 'error');
                setIsSubmitting(false);
                stopAppProcessing();
                return;
            }
        }
    }

    const updatedLoansList = loans.map(l => l.id === loanId ? { ...l, status: newStatus as any } : l);
    
    try {
        await saveLoans(updatedLoansList);
        setLoans(updatedLoansList);
        if (txCreated) {
            setTransactions(newTransactionsList);
        }
        if (typeof addSystemLog !== 'undefined') {
            await addSystemLog('UPDATE_LOAN_STATUS', \`تغییر وضعیت وام \$\{loan.id\} به \$\{newStatus\}\`, 'Loan', loan.id);
        }
        showNotification('وضعیت وام با موفقیت تغییر کرد.', 'success');
    } catch (err: any) {
        showNotification(err.message || 'خطا در تغییر وضعیت وام', 'error');
    }
    
    setIsSubmitting(false);
    stopAppProcessing();
  };

  const handlePayInstallment = async () => {`;

code = code.replace("  const handlePayInstallment = async () => {", updateStatusFn);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
