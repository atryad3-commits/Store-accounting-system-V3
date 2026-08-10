with open("src/components/loans/LoanDetailsView.tsx", "r") as f:
    lines = f.readlines()

# Find 'return (' and replace everything up to the first div with className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
start_idx = -1
for i, line in enumerate(lines):
    if "return (" in line:
        start_idx = i
        break

end_idx = -1
for i, line in enumerate(lines[start_idx:]):
    if '<div className="grid grid-cols-1' in line:
        end_idx = start_idx + i
        break

new_head = """  if (!isOpen || !loan) return null;

  return (
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

      <div className="p-6 md:p-8">
"""

lines = lines[:start_idx] + [new_head] + lines[end_idx:]

# Find the end tags
end_tag_idx = -1
for i in range(len(lines)-1, -1, -1):
    if "</AnimatePresence>" in lines[i]:
        end_tag_idx = i
        break

if end_tag_idx != -1:
    # replace from the div before Animate presence
    # let's just replace the last 6 lines
    new_tail = """      </div>
    </motion.div>
  );
}
"""
    lines = lines[:len(lines)-7] + [new_tail]

with open("src/components/loans/LoanDetailsView.tsx", "w") as f:
    f.writelines(lines)

