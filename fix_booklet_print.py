with open('src/components/loans/InstallmentBookletPrint.tsx', 'r') as f:
    text = f.read()

old_block = """{inst.status === 'paid' && inst.paidAmount ? (
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-600">مبلغ پرداخت شده:</span>
                        <span className="font-black text-emerald-600" dir="ltr">{formatCurrency(inst.paidAmount)} {currency}</span>
                      </div>
                    ) : null}"""

new_block = """{inst.status === 'paid' && inst.paidAmount ? (
                      <>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-600">مبلغ پرداخت شده:</span>
                        <span className="font-black text-emerald-600" dir="ltr">{formatCurrency(inst.paidAmount)} {currency}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-600">شماره رسید پرداختی:</span>
                        <span className="font-black text-slate-900">{inst.receiptNumber || '-'}</span>
                      </div>
                      </>
                    ) : null}"""

text = text.replace(old_block, new_block)

with open('src/components/loans/InstallmentBookletPrint.tsx', 'w') as f:
    f.write(text)
