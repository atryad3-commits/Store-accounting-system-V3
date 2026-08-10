const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const regex = /filteredLoans\.map\(loan => \{([\s\S]*?)\n\s*\}\)\n\s*\)/;

const newBlock = `filteredLoans.map(loan => {
               const loanInsts = (installments || []).filter(i => i.loanId === loan.id);
               const paidInsts = loanInsts.filter(i => i.status === 'paid').length;
               const totalInsts = loanInsts.length;
               const isExpanded = expandedLoanId === loan.id;

               return (
                 <div key={loan.id} className={\`bg-white rounded-2xl border \${isExpanded ? 'border-indigo-200 shadow-md ring-4 ring-indigo-50' : 'border-gray-100 shadow-sm'} overflow-hidden transition-all hover:border-gray-200 hover:shadow-md\`}>
                    <div className="p-6 flex flex-col lg:flex-row items-center gap-6 cursor-pointer" onClick={() => setExpandedLoanId(isExpanded ? null : loan.id)}>
                       
                       <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{backgroundColor: loan.type === 'given' ? '#eff6ff' : '#ecfdf5'}}>
                          <Wallet className={\`w-7 h-7 \${loan.type === 'given' ? 'text-blue-500' : 'text-emerald-500'}\`}/>
                       </div>

                       <div className="flex-1 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                          
                         <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1.5">
                               <h3 className="text-lg font-black text-gray-800">{getPersonName(loan.personId)}</h3>
                               <span className={\`px-2.5 py-1 rounded-lg text-xs font-black \${loan.type === 'given' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}\`}>
                                  {loan.type === 'given' ? 'پرداختی' : 'دریافتی'}
                               </span>
                               <span className={\`px-2.5 py-1 rounded-lg text-xs font-black \${LOAN_STATUS_COLORS[loan.status] || 'bg-gray-100 text-gray-600'}\`}>{LOAN_STATUS_LABELS[loan.status] || 'نامشخص'}</span>
                               <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold font-mono" dir="ltr">
                                  #{loan.loanNumber || loan.id}
                               </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                               <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> تاریخ: {formatDateDisplay(loan.startDate.replace(/\\-/g, '/'))}</span>
                               <span className="flex items-center gap-1.5"><Layers className="w-4 h-4"/> اقساط: {totalInsts} {loan.frequency === 'yearly' ? '(سالانه)' : loan.frequency === 'quarterly' ? '(فصلی)' : '(ماهانه)'}</span>
                               {loan.interestRate && <span className="flex items-center gap-1.5"><Percent className="w-4 h-4"/> سود: {loan.interestRate}٪</span>}
                            </div>
                         </div>

                         <div className="flex flex-col md:items-end gap-1">
                            <span className="text-xl font-black font-mono text-gray-900 tracking-tight" dir="ltr">{formatCurrency(loan.amount)}</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                               <span>پرداخت شده: {paidInsts} از {totalInsts}</span>
                               <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{width: \`\${(paidInsts/totalInsts)*100}%\`}}></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                               <button 
                                  onClick={(e) => { e.stopPropagation(); setExpandedLoanId(isExpanded ? null : loan.id); }}
                                  className={\`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all \${isExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}\`}
                               >
                                  {isExpanded ? 'بستن جزئیات' : 'جزئیات و عملیات'}
                                  <ChevronDown className={\`w-4 h-4 transition-transform \${isExpanded ? 'rotate-180' : ''}\`} />
                               </button>
                            </div>
                         </div>
                       </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                         <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-100 bg-gray-50/50"
                         >
                            <div className="p-6">
                               <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                  <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                                     <Activity className="w-5 h-5 text-indigo-500" />
                                     تغییر وضعیت وام
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                     {['requested', 'incomplete', 'completed_dossier', 'approved', 'active', 'completed'].map((st) => {
                                        const isActive = loan.status === st;
                                        const statusLabels = {
                                           requested: 'درخواست',
                                           incomplete: 'نقص پرونده',
                                           completed_dossier: 'تکمیل پرونده',
                                           approved: 'تایید شده',
                                           active: 'پرداخت شده',
                                           completed: 'تسویه شده'
                                        };
                                        return (
                                           <button
                                              key={st}
                                              onClick={() => handleUpdateLoanStatus(loan.id, st)}
                                              disabled={isSubmitting}
                                              className={\`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all \${isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'} disabled:opacity-50\`}
                                           >
                                              {isActive && <CheckCircle className="w-5 h-5" />}
                                              {statusLabels[st as keyof typeof statusLabels]}
                                           </button>
                                        );
                                     })}
                                  </div>
                               </div>

                               <div className="flex flex-col lg:flex-row gap-6">
                                  <div className="flex-1">
                                     <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-black text-gray-800 flex items-center gap-2">
                                           <List className="w-5 h-5 text-emerald-500" />
                                           گزارش اقساط
                                        </h4>
                                        <button
                                           onClick={() => { setSelectedLoanForPayment(loan.id as string); navigate('/loans_payment'); }}
                                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                                        >
                                           <CheckCircle className="w-4 h-4" />
                                           ثبت پرداختی قسط
                                        </button>
                                     </div>
                                     <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm max-h-[400px] overflow-y-auto">
                                        <table className="w-full text-sm text-right relative">
                                           <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 sticky top-0">
                                              <tr>
                                                 <th className="p-3">ردیف</th>
                                                 <th className="p-3">سررسید</th>
                                                 <th className="p-3">مبلغ قسط</th>
                                                 <th className="p-3">وضعیت</th>
                                              </tr>
                                           </thead>
                                           <tbody className="divide-y divide-gray-100">
                                              {loanInsts.map((inst, idx) => (
                                                 <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 font-bold text-gray-600">{idx + 1}</td>
                                                    <td className="p-3 font-mono font-medium">{formatDateDisplay(inst.dueDate.replace(/\\-/g, '/'))}</td>
                                                    <td className="p-3 font-black text-gray-900">{formatCurrency(inst.amount)}</td>
                                                    <td className="p-3">
                                                       <span className={\`px-2 py-1 rounded-lg text-xs font-bold \${inst.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : inst.status === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}\`}>
                                                          {inst.status === 'paid' ? 'پرداخت شده' : inst.status === 'overdue' ? 'معوق' : 'سررسید نشده'}
                                                       </span>
                                                    </td>
                                                 </tr>
                                              ))}
                                           </tbody>
                                        </table>
                                     </div>
                                  </div>

                                  <div className="w-full lg:w-64">
                                     <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-gray-500" />
                                        عملیات
                                     </h4>
                                     <div className="space-y-2">
                                        <button
                                           onClick={(e) => { e.stopPropagation(); setPrintingLoanId(loan.id as string); }}
                                           className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-colors shadow-sm"
                                        >
                                           <Printer className="w-5 h-5 text-gray-400" />
                                           چاپ دفترچه اقساط
                                        </button>
                                        {(userRole === 'admin' || userRole === 'manager') && (
                                           <button
                                              onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                                              className="w-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-colors shadow-sm"
                                           >
                                              <Trash2 className="w-5 h-5 text-rose-400" />
                                              حذف کامل وام
                                           </button>
                                        )}
                                     </div>
                                  </div>
                               </div>

                            </div>
                         </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               );
            })
          )`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
