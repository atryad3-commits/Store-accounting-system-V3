const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

// Replace button onClick
code = code.replace('() => handleSubmitPerson(e as any)', '() => handleCheckDuplicates(e as any)');

// Inject Duplicate Modal JSX right before the end of the main modal return
const modalJSX = `
{/* Duplicates Warning Modal */}
{showDuplicatesModal && (
    <div className="fixed inset-0 bg-slate-900/60 z-[999999] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-amber-900">احتمال تکراری بودن اطلاعات</h3>
            <p className="text-sm text-amber-700 mt-1">اشخاص زیر شباهت زیادی به اطلاعات وارد شده دارند.</p>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {duplicates.map((d: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">{d.name || d.companyName || d.firstName + ' ' + d.lastName}</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{d.nationalId || d.economicCode || '-'}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="truncate">{d.phone || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDuplicatesModal(false)}
            className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            اصلاح اطلاعات
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDuplicatesModal(false);
              handleSubmitPerson();
            }}
            className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
          >
            نادیده گرفتن و ثبت
          </button>
        </div>
      </motion.div>
    </div>
)}
`;

// Insert right before the last closing div of the main modal
const lastClosingDivMatch = `</motion.div>\n      </div>\n    </AnimatePresence>\n  );\n}`;
if(code.includes('</motion.div>\n      </div>\n    </AnimatePresence>\n  );\n}')) {
    code = code.replace(lastClosingDivMatch, modalJSX + lastClosingDivMatch);
} else {
    // try a different anchor
    const altMatch = `</motion.div>\n      </div>\n    </AnimatePresence>\n  );`;
    code = code.replace(altMatch, modalJSX + altMatch);
}

fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
console.log('Fixed submit button and injected duplicate modal.');
