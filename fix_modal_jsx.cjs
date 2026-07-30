const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

// For Legal (company)
const companyNationalIdMatch = `                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right md:col-span-1">`;
const companyReplacement = `                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      کد اقتصادی
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonEconomicCode}
                                      onChange={(e) => setNewPersonEconomicCode(e.target.value)}
                                      placeholder="مثال: ۴۱۱۱۱۱۱۱۱۱۱۱"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      شماره ثبت
                                    </label>
                                    <input
                                      type="text"
                                      value={newPersonRegistrationNumber}
                                      onChange={(e) => setNewPersonRegistrationNumber(e.target.value)}
                                      placeholder="مثال: ۱۲۳۴۵"
                                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                  <div className="w-full text-right md:col-span-1">`;

if(code.includes(companyNationalIdMatch)) {
    code = code.replace(companyNationalIdMatch, companyReplacement);
    fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
    console.log('Injected fields successfully');
} else {
    console.log('Failed to match company pattern');
}
