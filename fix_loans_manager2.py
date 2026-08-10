import sys

file_path = 'src/components/loans/LoansManager.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the button logic
import re

button_pattern = re.compile(
    r"<div className=\"flex items-center gap-2 mt-2\">\s+<button \s+onClick=\{\(e\) => \{ e\.stopPropagation\(\); setExpandedLoanId\(isExpanded \? null : loan\.id\); \}\}\s+className=\{`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all \$\{isExpanded \? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'\}`\}\s+>\s+\{isExpanded \? 'بستن جزئیات' : 'جزئیات و عملیات'\}\s+<ChevronDown className=\{`w-4 h-4 transition-transform \$\{isExpanded \? 'rotate-180' : ''\}`\} />\s+</button>\s+</div>"
)

new_button = """<div className="flex items-center gap-2 mt-2">
                               <button 
                                  onClick={(e) => { e.stopPropagation(); setExpandedLoanId(loan.id); }}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
                               >
                                  کارت وام (جزئیات و عملیات)
                               </button>
                            </div>"""

if button_pattern.search(content):
    content = button_pattern.sub(new_button, content)
    print("Button replaced.")
else:
    print("Button pattern not found.")

# Replace AnimatePresence block
animate_pattern = re.compile(
    r"<AnimatePresence>\s*\{isExpanded && \(\s*<motion\.div.*?</motion\.div>\s*\)\}\s*</AnimatePresence>",
    re.DOTALL
)

if animate_pattern.search(content):
    content = animate_pattern.sub("", content)
    print("AnimatePresence block removed.")
else:
    print("AnimatePresence block not found.")

# Add LoanCardModal at the end
# We need to find the closing div of LoansManager return
# Or just before LoansPayment which is around line 1120

payment_pattern = re.compile(r"\{activeTab === 'payment' && \(\s*<LoansPayment")
new_payment_block = """      <LoanCardModal
        isOpen={expandedLoanId !== null}
        onClose={() => setExpandedLoanId(null)}
        loan={loans.find(l => l.id === expandedLoanId) || null}
        installments={installments}
        formatCurrency={formatCurrency}
        getPersonName={getPersonName}
        userRole={userRole}
        handleUpdateLoanStatus={handleUpdateLoanStatus}
        handleDeleteLoan={handleDeleteLoan}
        setPrintingLoanId={setPrintingLoanId}
        onPayInstallment={(loanId) => {
           setExpandedLoanId(null);
           setSelectedLoanForPayment(loanId);
           navigate('/loans_payment');
        }}
        LOAN_STATUS_LABELS={LOAN_STATUS_LABELS}
        LOAN_STATUS_COLORS={LOAN_STATUS_COLORS}
        isSubmitting={isSubmitting}
      />
      
      {activeTab === 'payment' && (
         <LoansPayment"""

if payment_pattern.search(content):
    content = payment_pattern.sub(new_payment_block, content)
    print("Payment block modified.")
else:
    print("Payment block not found.")


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

