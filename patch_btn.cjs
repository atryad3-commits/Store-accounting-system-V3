const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const targetRegex = /<div className="flex items-center gap-2 text-sm font-medium text-gray-500">[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                               <span>پرداخت شده: {paidInsts} از {totalInsts}</span>
                               <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{width: \`\${(paidInsts/totalInsts)*100}%\`}}></div>
                               </div>
                            </div>
                            {(userRole === 'admin' || userRole === 'manager') && (
                               <button
                                 onClick={(e) => { e.stopPropagation(); handleDeleteLoan(loan.id); }}
                                 className="mt-2 text-rose-500 hover:text-rose-700 flex items-center gap-1 text-xs font-bold transition-colors"
                               >
                                  <Trash2 className="w-4 h-4" />
                                  حذف وام
                               </button>
                            )}`;

if (targetRegex.test(code)) {
    code = code.replace(targetRegex, replacement.replace(/\\$/g, "$"));
    fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
    console.log("Successfully patched");
} else {
    console.log("Target not found");
}
