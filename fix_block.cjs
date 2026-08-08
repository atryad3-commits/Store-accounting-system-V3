const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
const lines = content.split('\n');

const correctBlock = `                {selectedPersonBalance && selectedPersonBalance.value !== 0 && (
                   <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="pt-2">
                      <div className={\`text-xs font-bold p-3 rounded-xl border \${selectedPersonBalance.bg} \${selectedPersonBalance.color} flex flex-col gap-2\`}>
                         <div className="flex items-center justify-between">
                            <span>مانده این شخص: {formatCurrency(selectedPersonBalance.amount)} ({selectedPersonBalance.status})</span>
                         </div>
                         <button
                            type="button"
                            onClick={() => {
                               const useBal = !useBalanceAsAmount;
                               setUseBalanceAsAmount(useBal);
                               if (useBal) {
                                  setFormData({
                                     ...formData,
                                     amount: selectedPersonBalance.amount,
                                     type: selectedPersonBalance.value > 0 ? 'given' : 'received'
                                  });
                               }
                            }}
                            className="bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 mt-1 border-current border border-white/40"
                         >
                            <ArrowLeftRight className="w-3 h-3" />
                            {useBalanceAsAmount ? 'لغو استفاده از مانده' : 'تبدیل کل این مانده به وام'}
                         </button>
                      </div>
                   </motion.div>
                )}
             </div>`;

// find the index of `<option value="">انتخاب شخص...</option>` (around 694)
const startIndex = lines.findIndex(l => l.includes('<option value="">انتخاب شخص...</option>')) + 4;
// find the index of `<DollarSign className="w-4 h-4 text-gray-400" /> مبلغ کل وام` (around 732)
const endIndex = lines.findIndex(l => l.includes('<DollarSign className="w-4 h-4 text-gray-400" /> مبلغ کل وام')) - 2;

lines.splice(startIndex, endIndex - startIndex + 1, correctBlock);
fs.writeFileSync('src/components/loans/LoansManager.tsx', lines.join('\n'));
