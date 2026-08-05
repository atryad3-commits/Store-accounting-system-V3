const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const targetMethods = `    } catch (err: any) {
      showNotification(err.message || 'خطا در ثبت پرداخت', 'error');
      setIsSubmitting(false);
      return;
    }
    
    setPaymentForm({ installmentId: null, amount: '', accountId: '', paymentDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-') });
    setIsSubmitting(false);
  };`;

const newMethods = `    } catch (err: any) {
      showNotification(err.message || 'خطا در ثبت پرداخت', 'error');
      setIsSubmitting(false);
      return;
    }
    
    setPaymentForm({ installmentId: null, amount: '', accountId: '', paymentDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-') });
    setIsSubmitting(false);
  };

  const handleRevertInstallment = async (loanId: string | number, instId: string | number) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی بازگشت قسط را ندارید.', 'error');
      return;
    }
    if (!window.confirm('آیا از بازگشت این قسط به حالت پرداخت‌نشده اطمینان دارید؟')) return;
    
    setIsSubmitting(true);
    try {
       // Delete corresponding transaction
       const txsToDelete = transactions.filter(t => t.id.toString().startsWith(\`txn-inst-\${instId}\`));
       for (const tx of txsToDelete) {
           await deleteTransaction(tx.id);
       }
       setTransactions(transactions.filter(t => !txsToDelete.includes(t)));

       const updatedInstallments = installments.map(i => {
         if (i.id === instId) {
           return { ...i, status: 'pending', paidDate: undefined, paidAmount: undefined };
         }
         return i;
       });
       const loanInstallments = updatedInstallments.filter(i => i.loanId === loanId);
       const allPaid = loanInstallments.every(i => i.status === 'paid');
       
       const updatedLoans = loans.map(l => {
         if (l.id === loanId) {
           return { ...l, status: allPaid ? 'completed' : 'active' };
         }
         return l;
       });

       await saveInstallments(updatedInstallments);
       await saveLoans(updatedLoans);
       setInstallments(updatedInstallments);
       setLoans(updatedLoans);
       
       if (typeof addSystemLog !== 'undefined') {
          await addSystemLog('REVERT_INSTALLMENT', \`ابطال پرداخت قسط \${instId}\`, 'Installment', instId);
       }
       showNotification('وضعیت قسط به پرداخت‌نشده تغییر یافت.', 'success');
    } catch(err: any) {
       showNotification(err.message || 'خطا در عملیات', 'error');
    }
    setIsSubmitting(false);
  };

  const handleMarkOverdue = async (instId: string | number) => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      showNotification('شما دسترسی تغییر وضعیت قسط را ندارید.', 'error');
      return;
    }
    const updatedInstallments = installments.map(i => i.id === instId ? { ...i, status: 'overdue' as 'overdue' } : i);
    setInstallments(updatedInstallments);
    await saveInstallments(updatedInstallments);
    showNotification('قسط معوقه شد', 'warning');
  };`;

code = code.replace(targetMethods, newMethods);

const renderRevert = `                                         {inst.status === 'paid' && (
                                            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                              <CheckCircle className="w-4 h-4"/> پرداخت شده
                                           </div>
                                         )}`;

const newRenderRevert = `                                         {inst.status === 'paid' && (
                                            <div className="flex items-center gap-2">
                                              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4"/> پرداخت شده
                                              </div>
                                              {(userRole === 'admin' || userRole === 'manager') && (
                                                <button
                                                  onClick={() => handleRevertInstallment(loan.id, inst.id)}
                                                  disabled={isSubmitting}
                                                  className="text-gray-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50"
                                                  title="ابطال پرداخت"
                                                >
                                                  <RefreshCw className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                         )}`;

code = code.replace(renderRevert, newRenderRevert);

const renderOverdue = `                                                   <button
                                                     onClick={() => (() => {})(inst.id)}
                                                     className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
                                                   >
                                                      معوقه
                                                   </button>`;

const newRenderOverdue = `                                                   <button
                                                     onClick={() => handleMarkOverdue(inst.id)}
                                                     disabled={isSubmitting}
                                                     className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap disabled:opacity-50"
                                                   >
                                                      معوقه
                                                   </button>`;

code = code.replace(renderOverdue, newRenderOverdue);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
