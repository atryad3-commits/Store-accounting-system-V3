const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const amountInputRegex = /<input\s+type="text"\s+disabled=\{useBalanceAsAmount\}\s+value=\{formData\.amount[^>]+className="w-full[^>]+>/;

const match1 = content.match(amountInputRegex);
if (match1) {
    const wrappedAmount = `
                <div className="relative">
                  ${match1[0]}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    {storeSettings?.currency || 'تومان'}
                  </span>
                </div>`;
    content = content.replace(amountInputRegex, wrappedAmount);
}

const installmentInputRegex = /<input\s+type="text"\s+disabled=\{useBalanceAsAmount\}\s+value=\{formData\.installmentAmount[^>]+className="w-full[^>]+>/;
const match2 = content.match(installmentInputRegex);
if (match2) {
    const wrappedInstallment = `
                <div className="relative">
                  ${match2[0]}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    {storeSettings?.currency || 'تومان'}
                  </span>
                </div>`;
    content = content.replace(installmentInputRegex, wrappedInstallment);
}

// 4. Update the change status and booklet buttons
// Let's find the current buttons
const buttonsRegex = /<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); setStatusModalLoanId\(loan\.id as string\); \}\}\s+className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-bold transition-colors"\s*>\s*<Activity className="w-4 h-4" \/>\s*تغییر وضعیت\s*<\/button>\s*<button\s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); setPrintingLoanId\(loan\.id as string\); \}\}\s+className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-xs font-bold transition-colors"\s*>\s*<Printer className="w-4 h-4" \/>\s*چاپ دفترچه\s*<\/button>/g;

const newButtons = `<button
                                 onClick={(e) => { e.stopPropagation(); setStatusModalLoanId(loan.id as string); }}
                                 className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-black transition-colors"
                               >
                                  <Activity className="w-4 h-4" />
                                  تغییر وضعیت
                               </button>
                              <button
                                 onClick={(e) => { e.stopPropagation(); setPrintingLoanId(loan.id as string); }}
                                 className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-black transition-colors"
                               >
                                  <Printer className="w-4 h-4" />
                                  چاپ دفترچه
                               </button>`;

content = content.replace(buttonsRegex, newButtons);

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
