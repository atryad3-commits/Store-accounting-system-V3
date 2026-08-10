import re

with open("src/components/loans/LoanDetailsView.tsx", "r") as f:
    content = f.read()

bad = """              <div className="mb-8">
                 <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                    تغییر وضعیت وام
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {['requested', 'incomplete', 'completed_dossier', 'approved', 'active', 'completed'].map(st => {"""

good = """              <div className="mb-8">
                 <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                    تغییر وضعیت وام
                 </h4>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {['requested', 'incomplete', 'completed_dossier', 'approved', 'active', 'completed'].map(st => {"""

content = content.replace(bad, good)

bad_end = """                 </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">"""

good_end = """                 </div>
                 
                 {loan.history && loan.history.length > 0 && (
                   <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5">
                      <h5 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Layers className="w-4 h-4" />
                         تاریخچه وضعیت‌ها
                      </h5>
                      <div className="space-y-3">
                         {loan.history.map((hist, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${LOAN_STATUS_COLORS[hist.status] || 'bg-gray-100 text-gray-700'}`}>
                                     {LOAN_STATUS_LABELS[hist.status] || hist.status}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600">{hist.desc}</span>
                               </div>
                               <div className="text-xs text-gray-400 mt-2 sm:mt-0 font-mono" dir="ltr">
                                  {new Date(hist.date).toLocaleString('fa-IR')}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">"""

content = content.replace(bad_end, good_end)

with open("src/components/loans/LoanDetailsView.tsx", "w") as f:
    f.write(content)
