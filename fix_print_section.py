import re

with open("src/components/loans/InstallmentBookletPrint.tsx", "r") as f:
    content = f.read()

bad = """    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:fixed print:inset-0 print:bg-white print:p-0">
      <motion.div"""
good = """    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:fixed print:inset-0 print:bg-white print:p-0 print-section">
      <motion.div"""
content = content.replace(bad, good)

bad2 = """className="bg-white p-8 rounded-xl print:p-8 print:bg-white text-slate-900 print-section\""""
good2 = """className="bg-white p-8 rounded-xl print:p-8 print:bg-white text-slate-900\""""
content = content.replace(bad2, good2)

with open("src/components/loans/InstallmentBookletPrint.tsx", "w") as f:
    f.write(content)
