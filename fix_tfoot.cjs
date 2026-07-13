const fs = require('fs');
let content = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = 1148; // 1149-1
const endIndex = 1184; // 1185-1

const replacement = `                                        <td className="border-2 border-slate-700 py-3 px-6 text-left">
                                          <div
                                            className={\`flex items-center justify-end gap-1.5 font-extrabold \${
                                              totalBalance === 0
                                                ? "text-slate-600"
                                                : "text-slate-900"
                                            }\`}
                                          >
                                            {totalBalance === 0 ? (
                                              <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-700">
                                                صفر
                                              </span>
                                            ) : (
                                              <span className="text-[15px] tracking-tight">
                                                {toPersianDigits(formatNumber(Math.abs(totalBalance)))}
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="border-2 border-slate-700 py-3 px-4 text-center font-bold text-[13px] text-slate-800">
                                          {totalBalance !== 0 ? (
                                            <span className={\`\${totalBalance > 0 ? "text-rose-600" : "text-emerald-600"}\`}>
                                              {totalBalance > 0 ? "بد" : "بس"}
                                            </span>
                                          ) : "-"}
                                        </td>`;

lines.splice(startIndex, endIndex - startIndex + 1, replacement);
fs.writeFileSync('src/components/persons/PersonLedger.tsx', lines.join('\n'));
