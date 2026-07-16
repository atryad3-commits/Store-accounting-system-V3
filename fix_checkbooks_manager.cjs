const fs = require('fs');
let code = fs.readFileSync('src/components/financial/CheckbooksManager.tsx', 'utf-8');

const oldGridStart = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
const oldGridEnd = `</div>
      <AnimatePresence>`;

const startIndex = code.indexOf(oldGridStart);
const endIndex = code.indexOf(oldGridEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const oldGridCode = code.substring(startIndex, endIndex + 6); // include </div>

    const newTable = `<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="px-4 py-4 font-bold">حساب بانکی</th>
                <th className="px-4 py-4 font-bold">شماره شروع</th>
                <th className="px-4 py-4 font-bold">شماره پایان</th>
                <th className="px-4 py-4 font-bold">تعداد برگ</th>
                <th className="px-4 py-4 font-bold">تاریخ ثبت</th>
                <th className="px-4 py-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(checkbooks || []).map((cb: any) => {
                const bankAccount = accounts.find((a: any) => a.id == cb.accountId);
                const bankName = bankAccount?.bankName || 'حساب بانکی نامشخص';
                const accountNo = bankAccount?.accountNumber ? \`حساب: \${bankAccount.accountNumber}\` : '';
                return (
                  <tr key={cb.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-black text-indigo-950 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        {bankName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-1">{accountNo}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{cb.startNumber}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{cb.endNumber}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg text-xs">
                        {cb.totalLeaves} عدد
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {cb.issuedDate ? formatDateDisplay(cb.issuedDate, storeSettings?.calendarType) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setIssuedCheckbookFilter(cb.id.toString()); setActiveSubTab('issued_checks'); }} 
                          className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-transparent hover:border-emerald-200 bg-emerald-50"
                          title="مشاهده برگه‌های دسته چک"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </button>
                        <button 
                          onClick={() => editCheckbook(cb)} 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-transparent hover:border-indigo-200 bg-indigo-50"
                          title="ویرایش دسته چک"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCb(cb.id)} 
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-transparent hover:border-rose-200 bg-rose-50"
                          title="حذف دسته چک"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(checkbooks || []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center bg-slate-50/50">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold text-sm">هیچ دسته چکی یافت نشد.</p>
                    <p className="text-slate-400 text-xs mt-1">با کلیک روی دکمه "تعریف دسته چک جدید" دسته چک خود را اضافه کنید.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>`;

    code = code.replace(oldGridCode, newTable);
    fs.writeFileSync('src/components/financial/CheckbooksManager.tsx', code, 'utf-8');
    console.log('Successfully replaced grid with table.');
} else {
    console.log("Could not find grid bounds.");
}
