const fs = require('fs');
let content = fs.readFileSync('src/components/financial/PayReceiptModal.tsx', 'utf-8');

// Replace function signature
content = content.replace(
  'export default function ReceiptPaymentForm(props: any) {',
  'export default function PayReceiptModal(props: any) {\n  const { isOpen, onClose, ...rest } = props;\n  if (!isOpen) return null;'
);

// Remove activeTab from props
content = content.replace('activeTab,', '');

// Replace isReceive
content = content.replace(
  'const isReceive = activeTab === "create_receive_receipt";',
  'const isReceive = false;'
);

// Wrap return with modal
content = content.replace(
  '        return (\n          <motion.div',
  `        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-[90vh] overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">ثبت رسید پرداخت وجه</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">ثبت پرداختی‌های نقدی و چکی</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">`
);

// Close the modal divs
let lastDivMatch = content.lastIndexOf('</motion.div>');
content = content.substring(0, lastDivMatch) + '</div>\n            </motion.div>\n          </div>' + content.substring(lastDivMatch + 13);

fs.writeFileSync('src/components/financial/PayReceiptModal.tsx', content);
