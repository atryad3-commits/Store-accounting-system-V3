const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
  "addTransaction, checkFinancialYear",
  "addTransaction, deleteTransaction, checkFinancialYear"
);

const oldHandleDelete = `  const handleDeleteLoan = async (loanId: string | number) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی حذف وام را ندارید.', 'error');
      return;
    }
    
    if (!window.confirm('آیا از حذف این وام و اقساط آن اطمینان دارید؟')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedLoans = loans.filter(l => l.id !== loanId);
      const updatedInstallments = installments.filter(i => i.loanId !== loanId);
      await saveLoans(updatedLoans);
      await saveInstallments(updatedInstallments);
      setLoans(updatedLoans);
      setInstallments(updatedInstallments);
      if (typeof addSystemLog !== 'undefined') {
        await addSystemLog('DELETE_LOAN', \`حذف وام \${loanId}\`, 'Loan', loanId);
      }
      showNotification('وام با موفقیت حذف شد.', 'success');
    } catch (err: any) {
      showNotification(err.message || 'خطا در حذف وام', 'error');
    }
    setIsSubmitting(false);
  };`;

const newHandleDelete = `  const handleDeleteLoan = async (loanId: string | number) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی حذف وام را ندارید.', 'error');
      return;
    }
    
    if (!window.confirm('آیا از حذف این وام و اقساط آن اطمینان دارید؟')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const loanInsts = installments.filter(i => i.loanId === loanId);
      const instIds = loanInsts.map(i => i.id.toString());
      
      const txsToDelete = transactions.filter(t => {
          const tId = t.id.toString();
          if (tId === \`txn-loan-\${loanId}\`) return true;
          if (tId.startsWith('txn-inst-')) {
               return instIds.some(instId => tId.startsWith(\`txn-inst-\${instId}\`));
          }
          return false;
      });
      
      for (const tx of txsToDelete) {
          await deleteTransaction(tx.id);
      }

      const updatedLoans = loans.filter(l => l.id !== loanId);
      const updatedInstallments = installments.filter(i => i.loanId !== loanId);
      await saveLoans(updatedLoans);
      await saveInstallments(updatedInstallments);
      
      setTransactions(transactions.filter(t => !txsToDelete.includes(t)));
      setLoans(updatedLoans);
      setInstallments(updatedInstallments);
      
      if (typeof addSystemLog !== 'undefined') {
        await addSystemLog('DELETE_LOAN', \`حذف وام \${loanId}\`, 'Loan', loanId);
      }
      showNotification('وام با موفقیت حذف شد.', 'success');
    } catch (err: any) {
      showNotification(err.message || 'خطا در حذف وام', 'error');
    }
    setIsSubmitting(false);
  };`;

code = code.replace(oldHandleDelete, newHandleDelete);
fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
