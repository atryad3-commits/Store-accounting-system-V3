const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoanTransitionModal.tsx', 'utf8');

code = code.replace(
    /const \[reason, setReason\] = useState\(''\);/,
    `const [reason, setReason] = useState('');\n  const [rollbackConfirmed, setRollbackConfirmed] = useState(false);`
);

code = code.replace(
    /setEligibility\(null\);\n\s*setReason\(''\);/,
    `setEligibility(null);\n      setReason('');\n      setRollbackConfirmed(false);`
);

const checkboxCode = `
                {eligibility.direction === 'rollback' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rollbackConfirmed}
                        onChange={e => setRollbackConfirmed(e.target.checked)}
                        className="mt-1 w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                      />
                      <div className="text-sm text-amber-900 font-medium leading-relaxed">
                        تایید می‌کنم که قصد بازگشت وضعیت این وام به مرحله قبل را دارم. با این کار، سیستم به صورت خودکار اسناد حسابداری اصلاحی (معکوس) و تراکنش‌های برگشتی صادر خواهد کرد.
                      </div>
                    </label>
                  </div>
                )}
              </div>
`;

code = code.replace(/<\/div>\n\s*\) : \(\n\s*<div className="text-center text-rose-500 py-8">/, checkboxCode + `            ) : (\n              <div className="text-center text-rose-500 py-8">`);

code = code.replace(
    /disabled=\{submitting \|\| !eligibility\?\.allowed \|\| \(eligibility\?\.requiresReason && !reason\.trim\(\)\)\}/,
    `disabled={submitting || !eligibility?.allowed || (eligibility?.requiresReason && !reason.trim()) || (eligibility?.direction === 'rollback' && !rollbackConfirmed)}`
);

fs.writeFileSync('src/components/loans/LoanTransitionModal.tsx', code);
