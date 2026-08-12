import re

with open('src/components/modals/PreviewModals.tsx', 'r') as f:
    content = f.read()

replacement = """      {viewingCheck && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-hidden shadow-2xl relative">
            <button onClick={() => setViewingCheck(null)} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-indigo-500" />
                مشاهده اطلاعات چک {viewingCheck._type === 'issued' ? 'پرداختی' : viewingCheck._type === 'received' ? 'دریافتی' : ''}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">شماره چک</span>
                  <span className="font-black text-slate-800">{toPersianDigits(viewingCheck.checkNumber)}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">مبلغ چک</span>
                  <span className="font-black text-slate-800">{toPersianDigits(formatCurrency(viewingCheck.amount))} تومان</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">تاریخ سررسید</span>
                  <span className="font-black text-slate-800">{viewingCheck.dueDate}</span>
                </div>
                {viewingCheck.bankName && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-sm font-bold">نام بانک</span>
                    <span className="font-black text-slate-800">{viewingCheck.bankName}</span>
                  </div>
                )}
                {(viewingCheck.personId || viewingCheck.payeeId || viewingCheck.payerId) && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-sm font-bold">شخص مرتبط</span>
                    <span className="font-black text-slate-800">{getPersonDisplayName(viewingCheck.personId || viewingCheck.payeeId || viewingCheck.payerId, persons)}</span>
                  </div>
                )}
                {viewingCheck.description && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-sm font-bold block mb-1">بابت / توضیحات</span>
                    <p className="font-bold text-slate-800 text-sm whitespace-pre-wrap">{viewingCheck.description}</p>
                  </div>
                )}
                {viewingCheck.attachments && viewingCheck.attachments.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-sm font-bold block mb-2">تصاویر پیوست</span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {viewingCheck.attachments.map((att, idx) => (
                        <a key={idx} href={att} target="_blank" rel="noreferrer" className="shrink-0">
                          <img src={att} alt={`پیوست ${idx+1}`} className="h-24 w-24 object-cover rounded-lg border border-slate-200" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}"""

# regex replace
content = re.sub(r'      \{viewingCheck && \([\s\S]*?      \)\}', replacement, content)

with open('src/components/modals/PreviewModals.tsx', 'w') as f:
    f.write(content)

