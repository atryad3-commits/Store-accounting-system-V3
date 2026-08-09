const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const expandBlock = `                    </div>
                    
                    <AnimatePresence>
                      {expandedLoanId === loan.id && (
                         <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-100 bg-gray-50/50"
                         >
                            <div className="p-6">
                               <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-black text-gray-800 flex items-center gap-2">
                                     <List className="w-4 h-4 text-emerald-500" />
                                     گزارش اقساط
                                  </h4>
                                  <button
                                     onClick={(e) => { e.stopPropagation(); setSelectedLoanForPayment(loan.id as string); navigate('/loans_payment'); }}
                                     className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                                  >
                                     <CheckCircle className="w-4 h-4" />
                                     ثبت پرداختی قسط
                                  </button>
                               </div>
                               <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                  <table className="w-full text-sm text-right">
                                     <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
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
                                              <td className="p-3 font-mono font-medium">{formatDateDisplay(inst.dueDate.replace(/-/g, '/'))}</td>
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
                         </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               );`;

// Replace `</div>\n                 </div>\n               );`
content = content.replace(/<\/div>\s*<\/div>\s*\);\s*\}\)/, expandBlock + "\n            })");

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
