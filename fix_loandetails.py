with open('src/components/loans/LoanDetailsView.tsx', 'r') as f:
    text = f.read()

old_history_jsx = """{loan.history && loan.history.length > 0 && (
                   <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5">
                      <h5 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Layers className="w-4 h-4" />
                         تاریخچه وضعیت‌ها
                      </h5>
                      <div className="space-y-3">
                         {loan.history.map((hist, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${LOAN_STATUS_COLORS[hist.status] || 'bg-gray-100 text-gray-700'}`}>
                                     {LOAN_STATUS_LABELS[hist.status] || hist.status}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600">{hist.desc}</span>
                               </div>
                               <div className="text-xs text-gray-400 mt-2 sm:mt-0 font-mono" dir="ltr">
                                  {new Date(hist.date).toLocaleString('fa-IR')}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 )}"""

new_history_jsx = """{loan.history && loan.history.length > 0 && (
                   <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5">
                      <h5 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Layers className="w-4 h-4" />
                         تاریخچه وضعیت‌ها
                      </h5>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                         <table className="w-full text-right border-collapse">
                            <thead>
                               <tr className="bg-slate-100 text-slate-500 text-sm">
                                  <th className="p-3 font-bold">وضعیت</th>
                                  <th className="p-3 font-bold">تاریخ و زمان</th>
                                  <th className="p-3 font-bold">کاربر</th>
                                  <th className="p-3 font-bold">توضیحات</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                               {loan.history.map((hist, idx) => (
                                  <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                                     <td className="p-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${LOAN_STATUS_COLORS[hist.status] || 'bg-gray-100 text-gray-700'}`}>
                                           {LOAN_STATUS_LABELS[hist.status] || hist.status}
                                        </span>
                                     </td>
                                     <td className="p-3 text-sm font-medium text-slate-600 font-mono" dir="ltr">
                                        {new Date(hist.date).toLocaleString('fa-IR')}
                                     </td>
                                     <td className="p-3 text-sm font-medium text-slate-600">
                                        {hist.user || 'سیستم'}
                                     </td>
                                     <td className="p-3 text-sm font-medium text-slate-600">
                                        {hist.desc}
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                 )}"""

text = text.replace(old_history_jsx, new_history_jsx)

with open('src/components/loans/LoanDetailsView.tsx', 'w') as f:
    f.write(text)
