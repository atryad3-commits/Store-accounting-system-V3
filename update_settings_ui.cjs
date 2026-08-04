const fs = require('fs');
let file = fs.readFileSync('src/components/admin/SettingsTab.tsx', 'utf8');

const uiHtml = `                              <div className="mt-8 border-t border-gray-100 pt-8">
                                <h4 className="text-md font-black text-gray-800 mb-4 flex items-center gap-2">
                                  <lucide.ShieldCheck className="w-5 h-5 text-emerald-500" />
                                  تأییدیه چک‌های با مبلغ بالا (Maker-Checker)
                                </h4>
                                <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 shadow-sm">
                                  <div className="flex flex-col gap-4">
                                    <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-2">
                                        سقف مبلغ برای ثبت مستقیم (بدون نیاز به تأیید)
                                      </label>
                                      <div className="relative">
                                        <CurrencyInput
                                          value={settingsForm.checkApprovalThreshold || 0}
                                          onChange={(val) => setSettingsForm({ ...settingsForm, checkApprovalThreshold: val })}
                                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                        />
                                      </div>
                                      <p className="text-xs text-gray-500 mt-2 font-medium">
                                        اگر مبلغ چک بیشتر از این مقدار باشد، وضعیت چک «در انتظار تأیید» خواهد بود و باید توسط مدیر مالی تأیید شود. (عدد 0 به معنی عدم نیاز به تأیید است)
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
`;

file = file.replace(/                            <\/div>\n                          \)}\n\s*\{settingsTab === "numbering"/, uiHtml + '\n                          {settingsTab === "numbering"');

fs.writeFileSync('src/components/admin/SettingsTab.tsx', file);
