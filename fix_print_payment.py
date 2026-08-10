import re

with open("src/components/loans/InstallmentBookletPrint.tsx", "r") as f:
    content = f.read()

bad = """                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm font-semibold text-slate-600">تاریخ پرداخت:</span>
                      <span className="text-slate-400 text-xs">.......................................</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-slate-600">مهر و امضا:</span>
                      <span className="text-slate-400 text-xs">.......................................</span>
                    </div>"""

good = """                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm font-semibold text-slate-600">تاریخ پرداخت:</span>
                      <span className={`text-xs ${inst.paidDate ? 'font-black text-emerald-600' : 'text-slate-400'}`}>
                        {inst.paidDate ? inst.paidDate : '.......................................'}
                      </span>
                    </div>
                    {inst.status === 'paid' && inst.paidAmount ? (
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-600">مبلغ پرداخت شده:</span>
                        <span className="font-black text-emerald-600" dir="ltr">{formatCurrency(inst.paidAmount)} {currency}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-slate-600">مهر و امضا:</span>
                      <span className="text-slate-400 text-xs">
                        {inst.status === 'paid' ? '✔ تایید شده' : '.......................................'}
                      </span>
                    </div>"""

content = content.replace(bad, good)

with open("src/components/loans/InstallmentBookletPrint.tsx", "w") as f:
    f.write(content)

