const fs = require('fs');
let content = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = 1076; // 1077-1
const endIndex = 1133; // 1134-1

const replacement = `                                              <td className="border-2 border-slate-700 py-3 px-4 text-left align-top print:py-3 print:px-2">
                                                <span
                                                  className={\`font-black text-[14px] print:text-[12px] \${entry.debit > 0 ? "text-indigo-600" : "text-gray-300 font-medium"}\`}
                                                >
                                                  {entry.debit > 0
                                                    ? toPersianDigits(
                                                        formatNumber(
                                                          entry.debit,
                                                        ),
                                                      )
                                                    : "---"}
                                                </span>
                                              </td>
                                              <td className="border-2 border-slate-700 py-3 px-4 text-left align-top print:py-3 print:px-2">
                                                <span
                                                  className={\`font-black text-[14px] print:text-[12px] \${entry.credit > 0 ? "text-emerald-600" : "text-gray-300 font-medium"}\`}
                                                >
                                                  {entry.credit > 0
                                                    ? toPersianDigits(
                                                        formatNumber(
                                                          entry.credit,
                                                        ),
                                                      )
                                                    : "---"}
                                                </span>
                                              </td>
                                              <td className="border-2 border-slate-700 py-3 px-6 text-left align-top print:py-3 print:px-2">
                                                <div
                                                  className={\`flex items-center justify-end gap-1.5 font-extrabold \${
                                                    isBalZero
                                                      ? "text-slate-600"
                                                      : "text-slate-900"
                                                  }\`}
                                                >
                                                  {isBalZero ? (
                                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs shadow-sm text-slate-700">
                                                      صفر
                                                    </span>
                                                  ) : (
                                                    <span className="text-[15px] print:text-[13px] tracking-tight">
                                                      {toPersianDigits(
                                                        formatNumber(
                                                          Math.abs(
                                                            entry.runningBalance,
                                                          ),
                                                        ),
                                                      )}
                                                    </span>
                                                  )}
                                                </div>
                                              </td>
                                              <td className="border-2 border-slate-700 py-3 px-4 text-center align-top font-bold text-[13px] text-slate-800 print:py-3 print:px-2">
                                                <span className={\`\${!isBalZero ? (isDeb ? "text-rose-600" : "text-emerald-600") : "text-slate-400"}\`}>
                                                  {!isBalZero ? (isDeb ? "بد" : "بس") : "-"}
                                                </span>
                                              </td>`;

lines.splice(startIndex, endIndex - startIndex + 1, replacement);
fs.writeFileSync('src/components/persons/PersonLedger.tsx', lines.join('\n'));
