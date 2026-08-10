import sys

# Update LoansManager.tsx
file_path_lm = 'src/components/loans/LoansManager.tsx'
with open(file_path_lm, 'r', encoding='utf-8') as f:
    lm_content = f.read()

# Replace handleUpdateLoanStatus with state update to open modal
target_handler = """  const handleUpdateLoanStatus = async (loanId: string | number, newStatus: string) => {
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
      active: ['completed', 'overdue'],
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
        const transactionId = `txn-loan-${loan.id}`;
        
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
                description: loan.type === 'given' ? `اعطای وام پرداختی شماره ${loan.loanNumber || loan.id}` : `اخذ وام دریافتی شماره ${loan.loanNumber || loan.id}`,
                date: new Date().toLocaleDateString('fa-IR').replace(/\//g, '-'),
                documentNumber: `LOAN-${loan.loanNumber || loan.id}`,
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
            await addSystemLog('UPDATE_LOAN_STATUS', `تغییر وضعیت وام ${loan.loanNumber || loan.id} به ${newStatus}`, 'Loan', loan.id);
        }
        showNotification('وضعیت وام با موفقیت به‌روزرسانی شد.', 'success');
    } catch (err: any) {
        setLoans(loans); // rollback
        showNotification(err.message || 'خطا در تغییر وضعیت وام', 'error');
    }
    setIsSubmitting(false);
    stopAppProcessing();
  };"""

replacement_handler = """  const [transitionState, setTransitionState] = useState<{loanId: string | number, newStatus: string} | null>(null);

  const handleUpdateLoanStatus = async (loanId: string | number, newStatus: string) => {
    setTransitionState({ loanId, newStatus });
  };"""

if target_handler in lm_content:
    lm_content = lm_content.replace(target_handler, replacement_handler)
    print("Replaced handleUpdateLoanStatus in LoansManager")
else:
    print("Could not find handleUpdateLoanStatus in LoansManager")

# Add TransitionModal to LoansManager
modal_import = "import LoanTransitionModal from './LoanTransitionModal';\n"
if "LoanTransitionModal" not in lm_content:
    lm_content = lm_content.replace("import LoanCardModal from './LoanCardModal';", "import LoanCardModal from './LoanCardModal';\n" + modal_import)

modal_jsx = """      {transitionState && (
        <LoanTransitionModal
          isOpen={true}
          onClose={() => setTransitionState(null)}
          loan={loans.find(l => l.id === transitionState.loanId) as Loan}
          targetStatus={transitionState.newStatus as any}
          userRole={userRole}
          LOAN_STATUS_LABELS={LOAN_STATUS_LABELS}
          showNotification={showNotification}
          onSuccess={(updatedLoan) => {
            setLoans(loans.map(l => l.id === updatedLoan.id ? updatedLoan : l));
            // Trigger refresh of other data (transactions, docs) if needed, but since it's a demo, the user can reload or we can fetch.
            // Ideally we should refetch global data here.
          }}
        />
      )}
      
      {activeTab === 'payment' && ("""

lm_content = lm_content.replace("{activeTab === 'payment' && (", modal_jsx)

with open(file_path_lm, 'w', encoding='utf-8') as f:
    f.write(lm_content)


