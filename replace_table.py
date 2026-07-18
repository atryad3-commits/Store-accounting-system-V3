import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

pattern = r'return \(\s*<table className="w-full text-right min-w-\[950px\] print:min-w-\[0px\] print:text-\[12px\] text-sm border-collapse border-2 border-slate-700">'

replacement = """return (
                                    <div className="w-full">
                                      <div className="md:hidden flex flex-col gap-3 p-3">
                                        {filteredLedgerEntries.map((entry, index) => {
                                          const isDeb = entry.debit > 0;
                                          const isCred = entry.credit > 0;
                                          const isBalancePos = entry.runningBalance > 0;
                                          const isBalanceNeg = entry.runningBalance < 0;
                                          return (
                                            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 relative">
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                                                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                  {new Date(entry.date).toLocaleDateString("fa-IR")}
                                                </span>
                                              </div>
                                              
                                              <div className="font-bold text-slate-800 text-sm mb-2">{entry.description}</div>
                                              
                                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                                <div className="flex flex-col gap-1 p-2 bg-rose-50 rounded-xl">
                                                  <span className="text-rose-600 font-bold opacity-70">بدهکار</span>
                                                  <span className="font-black text-rose-700">{entry.debit > 0 ? toPersianDigits(formatNumber(entry.debit)) : "-"}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 p-2 bg-emerald-50 rounded-xl">
                                                  <span className="text-emerald-600 font-bold opacity-70">بستانکار</span>
                                                  <span className="font-black text-emerald-700">{entry.credit > 0 ? toPersianDigits(formatNumber(entry.credit)) : "-"}</span>
                                                </div>
                                              </div>
                                              
                                              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl mt-1">
                                                <span className="text-xs font-bold text-slate-500">مانده</span>
                                                <div className="flex items-center gap-1.5">
                                                  <span className="font-black text-slate-800">
                                                    {toPersianDigits(formatNumber(Math.abs(entry.runningBalance)))}
                                                  </span>
                                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${isBalancePos ? "bg-rose-100 text-rose-700" : isBalanceNeg ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                                                    {isBalancePos ? "بدهکار" : isBalanceNeg ? "بستانکار" : "بی‌حساب"}
                                                  </span>
                                                </div>
                                              </div>
                                              
                                              <div className="absolute top-4 left-4 flex gap-1">
                                                <PersonLedgerActionsDropdown entry={entry} personId={personId} persons={persons} onEdit={onEdit} fetchPersons={fetchPersons} />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-right min-w-[950px] print:min-w-[0px] print:text-[12px] text-sm border-collapse border-2 border-slate-700">"""

content = re.sub(pattern, replacement, content)

# And now carefully append the two divs at the end of the table
pattern2 = r'</tfoot>\s*</table>\s*\);\s*}\)\(\)}'
replacement2 = """</tfoot>
                                  </table>
                                      </div>
                                    </div>
                                  );
                                })()}"""

content = re.sub(pattern2, replacement2, content)

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
