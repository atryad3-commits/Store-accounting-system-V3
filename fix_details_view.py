import re

with open("src/components/loans/LoanDetailsView.tsx", "r") as f:
    content = f.read()

# Replace the component name
content = content.replace("export default function LoanCardModal({", "export default function LoanDetailsView({")

# Replace the modal wrapper
bad_wrapper = """  return (
    <AnimatePresence>
      {isOpen && loan && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-full md:w-[90vw] md:max-w-5xl md:max-h-[90vh] overflow-hidden flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${loan.type === 'given' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Wallet className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-gray-800">جزئیات پرونده وام</h2>
                    <p className="text-sm text-gray-500 mt-1">شماره وام: <span className="font-mono">{loan.loanNumber || loan.id}</span></p>
                 </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">"""

good_wrapper = """  if (!isOpen || !loan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
      dir="rtl"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${loan.type === 'given' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Wallet className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-800">جزئیات پرونده وام</h2>
              <p className="text-sm text-gray-500 mt-1">شماره وام: <span className="font-mono">{loan.loanNumber || loan.id}</span></p>
           </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
        >
          <span>بازگشت به لیست</span>
        </button>
      </div>

      <div className="p-6 md:p-8">"""

content = content.replace(bad_wrapper, good_wrapper)

bad_end = """            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );"""

good_end = """      </div>
    </motion.div>
  );"""

content = content.replace(bad_end, good_end)

with open("src/components/loans/LoanDetailsView.tsx", "w") as f:
    f.write(content)
