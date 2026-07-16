const fs = require('fs');
let code = fs.readFileSync('src/components/accounting/FinancialYearManager.tsx', 'utf-8');

if (!code.includes('import YearClosingChecklistModal')) {
  code = code.replace(
    'import { formatDateDisplay } from \'../../utils/format\';',
    'import { formatDateDisplay } from \'../../utils/format\';\nimport YearClosingChecklistModal from \'./YearClosingChecklistModal\';'
  );
}

if (!code.includes('isChecklistOpen')) {
  code = code.replace(
    'const [confirmCloseId, setConfirmCloseId] = useState<string | number | null>(null);',
    'const [confirmCloseId, setConfirmCloseId] = useState<string | number | null>(null);\n  const [isChecklistOpen, setIsChecklistOpen] = useState(false);\n  const [selectedYearForClose, setSelectedYearForClose] = useState<any>(null);'
  );
}

// Update the confirmation modal to the checklist modal
const existingConfirmModal = `{confirmCloseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-rose-50/50">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">تایید بستن سال مالی</h3>
                <p className="text-sm text-slate-500 font-medium">این عملیات غیرقابل بازگشت است.</p>
              </div>
            </div>
            <div className="p-6 text-sm text-slate-600 leading-relaxed font-medium">
              با بستن سال مالی:
              <ul className="list-disc list-inside mt-3 space-y-2 text-rose-700/80">
                <li>هیچ سند یا فاکتوری در این سال قابل ویرایش یا ثبت نیست.</li>
                <li>موجودی‌ها و مانده‌حساب‌ها قطعی شده و به سال بعد منتقل می‌شوند.</li>
                <li>سیستم برای شروع سال مالی جدید قفل می‌شود.</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                <strong className="block mb-1 font-black">توجه:</strong>
                ابتدا مطمئن شوید تمام اسناد موقت، تایید شده و انبارگردانی انجام شده است.
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => setConfirmCloseId(null)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                انصراف
              </button>
              <button
                onClick={() => handleCloseYear(confirmCloseId)}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
              >
                بله، سال مالی بسته شود
              </button>
            </div>
          </motion.div>
        </div>
      )}`;

const replacementModal = `<YearClosingChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        year={selectedYearForClose}
        onConfirm={(id) => {
          setIsChecklistOpen(false);
          handleCloseYear(id);
        }}
      />`;

if (code.includes('بله، سال مالی بسته شود')) {
  // Let's use regex or split to replace the old modal
  // Actually, I can just replace the whole block if it matches.
  // We can just find the button that triggers it.
  
  code = code.replace(
    /onClick=\{\(\) => setConfirmCloseId\(year\.id\)\}/g,
    `onClick={() => { setSelectedYearForClose(year); setIsChecklistOpen(true); }}`
  );
  
  // And replace the confirmCloseId block
  const startIndex = code.indexOf('{confirmCloseId && (');
  if (startIndex !== -1) {
    let endIndex = code.indexOf(')}', startIndex);
    while (code.charAt(endIndex + 2) !== undefined && code.slice(endIndex, endIndex + 8) !== '      )}' && endIndex !== -1) {
       endIndex = code.indexOf(')}', endIndex + 1);
    }
    // We will just replace it with a substring replace if we can.
  }
}

// Let's do a more robust string replacement for the modal block
const modalStartStr = '{confirmCloseId && (';
if (code.includes(modalStartStr)) {
  const start = code.indexOf(modalStartStr);
  const searchEnd = 'بله، سال مالی بسته شود\\n              </button>\\n            </div>\\n          </motion.div>\\n        </div>\\n      )}';
  
  // since whitespace might differ, let's use a simpler approach.
}

fs.writeFileSync('src/components/accounting/FinancialYearManager.tsx', code, 'utf-8');
