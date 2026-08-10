import re

with open("src/components/loans/LoansManager.tsx", "r") as f:
    content = f.read()

bad = """        {activeTab === 'list' && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="space-y-6"
        >"""

good = """        {activeTab === 'list' && expandedLoanId === null && (
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           className="space-y-6"
        >"""

content = content.replace(bad, good)

bad2 = """              <LoanDetailsView
        isOpen={expandedLoanId !== null}"""

good2 = """        {expandedLoanId !== null && (
              <LoanDetailsView
        isOpen={expandedLoanId !== null}"""

bad2_end = """        isSubmitting={isSubmitting}
      />
      
            {transitionState && ("""

good2_end = """        isSubmitting={isSubmitting}
      />
        )}
      
            {transitionState && ("""

content = content.replace(bad2, good2).replace(bad2_end, good2_end)

with open("src/components/loans/LoansManager.tsx", "w") as f:
    f.write(content)

