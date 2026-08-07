const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const statusSelectorUI = `
                                <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200">
                                  <h4 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-400"/>
                                    وضعیت وام
                                  </h4>
                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <select
                                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full sm:w-64 font-medium"
                                      value={loan.status}
                                      onChange={(e) => handleUpdateLoanStatus(loan.id, e.target.value)}
                                      disabled={isSubmitting || (userRole !== 'admin' && userRole !== 'manager')}
                                    >
                                      <option value="requested">درخواست</option>
                                      <option value="incomplete">نقص پرونده</option>
                                      <option value="completed_dossier">تکمیل پرونده</option>
                                      <option value="approved">تایید شده</option>
                                      <option value="active">پرداخت شده / در جریان</option>
                                      <option value="completed">تسویه شده</option>
                                      <option value="overdue">معوق</option>
                                    </select>
                                    <span className="text-xs text-gray-500 font-medium">
                                      {loan.status === 'active' ? 'در این مرحله، سند حسابداری و رسید بابت پرداخت/دریافت ثبت شده است.' : 'با تغییر وضعیت به «پرداخت شده»، سند حسابداری و رسید ثبت خواهد شد.'}
                                    </span>
                                  </div>
                                </div>
                                <h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
`;

code = code.replace(
    /<h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">/g,
    statusSelectorUI
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
