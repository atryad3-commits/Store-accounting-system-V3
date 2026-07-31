const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SettingsTab.tsx', 'utf8');

const targetStr = `                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`;
const replaceStr = `                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="w-full text-right bg-white p-5 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <label className="block text-sm font-bold text-gray-800 mb-1">
                                        استفاده از اعداد اعشاری در مقادیر
                                      </label>
                                      <p className="text-xs text-gray-500">
                                        در صورت فعال بودن، می‌توانید تعداد اعشار برای قیمت و تعداد را مشخص کنید.
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setSettingsForm({ ...settingsForm, use_decimals: !settingsForm.use_decimals })}
                                      className={\`w-12 h-6 rounded-full p-1 transition-colors \${settingsForm.use_decimals ? "bg-indigo-600" : "bg-gray-300"}\`}
                                    >
                                      <div className={\`bg-white w-4 h-4 rounded-full shadow-sm transition-transform transform \${settingsForm.use_decimals ? "-translate-x-6" : "translate-x-0"}\`}></div>
                                    </button>
                                  </div>
                                  
                                  {settingsForm.use_decimals && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                      <label className="block text-sm font-bold text-gray-700 mb-2">
                                        تعداد ارقام اعشار مجاز
                                      </label>
                                      <select
                                        value={settingsForm.decimal_places || 2}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, decimal_places: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm text-right"
                                        dir="rtl"
                                      >
                                        <option value={1}>۱ رقم اعشار</option>
                                        <option value={2}>۲ رقم اعشار</option>
                                        <option value={3}>۳ رقم اعشار</option>
                                        <option value={4}>۴ رقم اعشار</option>
                                      </select>
                                    </div>
                                  )}
                                </div>
`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/admin/SettingsTab.tsx', code);
console.log('patched settings decimals');
