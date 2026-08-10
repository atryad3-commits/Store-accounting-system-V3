import re

with open("src/components/loans/LoanDetailsView.tsx", "r") as f:
    content = f.read()

# I will replace the start of the return
bad = re.compile(r'return \(\s*<AnimatePresence>\s*\{isOpen && \(\s*<>\s*<motion\.div[^>]*/>\s*<motion\.div[^>]*>\s*<div[^>]*>.*?</div>\s*<div className="flex-1 overflow-y-auto p-6 lg:p-8">', re.DOTALL)

good = """return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full"
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

content = re.sub(bad, good, content)

bad_end = re.compile(r'</div>\s*</motion\.div>\s*</>\s*\)\}\s*</AnimatePresence>\s*\);\s*\}', re.DOTALL)

good_end = """      </div>
    </motion.div>
  );
}"""

content = re.sub(bad_end, good_end, content)

with open("src/components/loans/LoanDetailsView.tsx", "w") as f:
    f.write(content)
