const fs = require('fs');
let code = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf-8');

const oldModalStart = `        {isIssuedModalOpen && (
          <div key="isIssuedModalOpen-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-base font-black text-rose-950 flex items-center gap-1.5">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  {editingIssuedCheckId ? 'ویرایش صدور چک' : 'دستور صدور چک جدید (پرداختنی)'}
                </h3>
                <button onClick={() => setIsIssuedModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleIssueCheckSubmit} className="space-y-4 text-right">`;

const newModalStart = `        {isIssuedModalOpen && (
          <div key="isIssuedModalOpen-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl border flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 border-b pb-3 shrink-0">
                <h3 className="text-base font-black text-rose-950 flex items-center gap-1.5">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  {editingIssuedCheckId ? 'ویرایش صدور چک' : 'دستور صدور چک جدید (پرداختنی)'}
                </h3>
                <button onClick={() => setIsIssuedModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 pl-1 pr-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <form onSubmit={handleIssueCheckSubmit} className="space-y-4 text-right">`;

const oldModalEnd = `                <div className="flex justify-end gap-2.5 pt-4 border-t">
                  <button type="button" onClick={() => setIsIssuedModalOpen(false)} className="px-4 py-2 border bg-white border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">انصراف</button>
                  <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm">{editingIssuedCheckId ? 'ذخیره تغییرات' : 'تایید و صدور برگه چک'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}`;

const newModalEnd = `                <div className="flex justify-end gap-2.5 pt-4 border-t">
                  <button type="button" onClick={() => setIsIssuedModalOpen(false)} className="px-4 py-2 border bg-white border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">انصراف</button>
                  <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm">{editingIssuedCheckId ? 'ذخیره تغییرات' : 'تایید و صدور برگه چک'}</button>
                </div>
              </form>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full min-h-[350px]">
                    <h4 className="text-sm font-black text-slate-700 mb-6 flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-indigo-500" />
                      تعهدات پرداختی در محدوده سررسید (بازه ۱ ماهه)
                    </h4>
                    {icDueDate ? (
                      <div className="flex-1 w-full h-full">
                        {(() => {
                           const targetDate = new Date(icDueDate);
                           const start = new Date(targetDate); start.setDate(start.getDate() - 15);
                           const end = new Date(targetDate); end.setDate(end.getDate() + 15);
                           const filtered = issuedChecks.filter(c => {
                             if (!c.dueDate || c.status === 'blank' || c.status === 'cancelled') return false;
                             const d = new Date(c.dueDate);
                             return d >= start && d <= end;
                           });
                           
                           if (filtered.length === 0) {
                             return <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3"><CheckCircle className="w-12 h-12 text-emerald-200" /><span className="text-sm font-bold">هیچ پرداختی در این بازه زمانی وجود ندارد.</span></div>;
                           }
                           
                           const grouped = {};
                           filtered.forEach(c => {
                             let dStr;
                             try {
                               dStr = new Date(c.dueDate).toLocaleDateString('fa-IR');
                             } catch (e) {
                               dStr = c.dueDate;
                             }
                             grouped[dStr] = (grouped[dStr] || 0) + Number(c.amount);
                           });
                           
                           const chartData = Object.entries(grouped).map(([date, amount]) => ({ date, amount })).sort((a,b) => a.date.localeCompare(b.date));
                           
                           return (
                             <ResponsiveContainer width="100%" height={280}>
                               <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                 <XAxis dataKey="date" tick={{fontSize: 10, fill: '#6B7280'}} tickMargin={10} axisLine={false} tickLine={false} />
                                 <YAxis tickFormatter={(val) => (val/1000000).toFixed(0) + 'm'} tick={{fontSize: 10, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                 <Tooltip formatter={(value) => [Number(value).toLocaleString() + ' تومان', 'جمع مبالغ پرداختی']} labelStyle={{color: '#374151', fontWeight: 'bold'}} />
                                 <Bar dataKey="amount" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                               </BarChart>
                             </ResponsiveContainer>
                           );
                        })()}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-400 text-center space-y-3">
                        <Calendar className="w-12 h-12 text-slate-200" />
                        <span className="font-bold">برای مشاهده نمودار، ابتدا تاریخ سررسید را انتخاب کنید.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}`;

if (code.includes(oldModalStart) && code.includes(oldModalEnd)) {
  code = code.replace(oldModalStart, newModalStart);
  code = code.replace(oldModalEnd, newModalEnd);
  fs.writeFileSync('src/components/financial/CheckManagement.tsx', code, 'utf-8');
  console.log('Patched CheckManagement.tsx successfully.');
} else {
  console.log('Failed to find replace blocks.');
}
