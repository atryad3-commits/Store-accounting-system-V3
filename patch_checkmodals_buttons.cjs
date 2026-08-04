const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/CheckModals.tsx', 'utf8');

const newButtons = `
                    <div className="flex gap-2 flex-wrap items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {updatingCheckType === 'issued' ? (
                        <>
                          <div className="text-xs font-bold text-gray-500 bg-white border px-3 py-2 rounded-lg">وضعیت فعلی: {currentActualStatus === 'issued' ? 'در جریان' : currentActualStatus === 'cashed' ? 'پاس شده' : currentActualStatus === 'bounced' ? 'برگشتی' : currentActualStatus === 'cancelled' ? 'باطل شده' : 'سفید'}</div>
                          {validTransitions.length > 0 && <ArrowLeft className="w-3 h-3 text-gray-300 mx-1" />}
                          {validTransitions.includes('issued') && (
                            <button type="button" onClick={() => setStatusVal('issued')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'issued' ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'}\`}>در جریان (صادره)</button>
                          )}
                          {validTransitions.includes('cashed') && (
                            <button type="button" onClick={() => setStatusVal('cashed')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'cashed' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}\`}>پاس شده</button>
                          )}
                          {validTransitions.includes('bounced') && (
                            <button type="button" onClick={() => setStatusVal('bounced')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'bounced' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'}\`}>برگشتی</button>
                          )}
                          {validTransitions.includes('cancelled') && (
                            <button type="button" onClick={() => setStatusVal('cancelled')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'cancelled' ? 'bg-slate-600 text-white border-slate-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}\`}>باطل شده</button>
                          )}
                          {validTransitions.length === 0 && <span className="text-xs text-rose-500 font-bold mr-2">هیچ انتقال مجازی از این وضعیت تعریف نشده است.</span>}
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-bold text-gray-500 bg-white border px-3 py-2 rounded-lg">وضعیت فعلی: {currentActualStatus === 'received' ? 'دریافت شده' : currentActualStatus === 'deposited' ? 'خوابانده به حساب' : currentActualStatus === 'cashed' ? 'وصول شده' : currentActualStatus === 'assigned' ? 'خرج شده' : currentActualStatus === 'bounced_assigned' ? 'برگشتی خرج شده' : currentActualStatus === 'bounced' ? 'برگشتی موجود' : currentActualStatus === 'returned' ? 'عودت داده شده' : 'نامشخص'}</div>
                          {validTransitions.length > 0 && <ArrowLeft className="w-3 h-3 text-gray-300 mx-1" />}
                          {validTransitions.includes('received') && (
                            <button type="button" onClick={() => setStatusVal('received')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'received' ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'}\`}>دریافت شده</button>
                          )}
                          {validTransitions.includes('deposited') && (
                            <button type="button" onClick={() => setStatusVal('deposited')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'deposited' ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105' : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-50'}\`}>خوابانده به حساب</button>
                          )}
                          {validTransitions.includes('cashed') && (
                            <button type="button" onClick={() => setStatusVal('cashed')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'cashed' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}\`}>وصول شده</button>
                          )}
                          {validTransitions.includes('assigned') && (
                            <button type="button" onClick={() => setStatusVal('assigned')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'assigned' ? 'bg-orange-600 text-white border-orange-700 shadow-md scale-105' : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50'}\`}>خرج شده (واگذاری)</button>
                          )}
                          {validTransitions.includes('bounced_assigned') && (
                            <button type="button" onClick={() => setStatusVal('bounced_assigned')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'bounced_assigned' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'}\`}>برگشتی (خرج شده)</button>
                          )}
                          {validTransitions.includes('bounced') && (
                            <button type="button" onClick={() => setStatusVal('bounced')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'bounced' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'}\`}>برگشتی (موجود)</button>
                          )}
                          {validTransitions.includes('returned') && (
                            <button type="button" onClick={() => setStatusVal('returned')} className={\`px-3 py-2 text-xs font-bold rounded-lg transition-all border \${statusVal === 'returned' ? 'bg-slate-600 text-white border-slate-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}\`}>عودت داده شده</button>
                          )}
                          {validTransitions.length === 0 && <span className="text-xs text-rose-500 font-bold mr-2">هیچ انتقال مجازی از این وضعیت تعریف نشده است.</span>}
                        </>
                      )}
                    </div>
`;

// we are replacing from <div className="flex gap-2 flex-wrap items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
// to </div> just before {updatingCheckType === 'received'

const regex = /<div className="flex gap-2 flex-wrap items-center bg-gray-50 p-3 rounded-xl border border-gray-100">[\s\S]*?<\/div>\s*<\/div>\s*\{updatingCheckType === 'received'/;

file = file.replace(regex, newButtons.trim() + '\n                  </div>\n\n                  {updatingCheckType === \'received\'');

fs.writeFileSync('src/components/financial/checks/CheckModals.tsx', file);
