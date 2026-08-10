with open("src/components/loans/InstallmentBookletPrint.tsx", "r") as f:
    content = f.read()

bad_snippet = """                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm font-semibold text-slate-600">کد قسط:</span>
                      <span className="font-black text-slate-900 tracking-widest font-mono">{inst.installmentCode || '-'}</span>
                    </div>
                      <span className="text-sm font-semibold text-slate-600">تاریخ سررسید:</span>"""

good_snippet = """                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm font-semibold text-slate-600">کد قسط:</span>
                      <span className="font-black text-slate-900 tracking-widest font-mono">{inst.installmentCode || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm font-semibold text-slate-600">تاریخ سررسید:</span>"""

content = content.replace(bad_snippet, good_snippet)
with open("src/components/loans/InstallmentBookletPrint.tsx", "w") as f:
    f.write(content)
