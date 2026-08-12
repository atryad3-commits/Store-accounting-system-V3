const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /const firstDateIso = convertToGregorian\(formData\.startDate\)\.split\('T'\)\[0\];/,
    `const firstDateIso = convertToGregorian(formData.firstInstallmentDate || formData.startDate).split('T')[0];`
);

const firstInstInput = `
             <div>
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    تاریخ ثبت وام <span className="text-rose-500">*</span>
                </label>
                <CustomDatePicker
                  value={formData.startDate}
                  format="YYYY/MM/DD"
                  onChange={(date: any) => setFormData({...formData, startDate: date})}
                  inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"
                />
             </div>
             <div>
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    تاریخ اولین قسط <span className="text-rose-500">*</span>
                </label>
                <CustomDatePicker
                  value={formData.firstInstallmentDate}
                  format="YYYY/MM/DD"
                  onChange={(date: any) => setFormData({...formData, firstInstallmentDate: date})}
                  inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"
                />
             </div>
`;

code = code.replace(
    /<div>\s*<label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">\s*<Calendar className="w-4 h-4 text-emerald-600" \/>\s*تاریخ شروع \/ ثبت وام <span className="text-rose-500">\*<\/span>\s*<\/label>\s*<CustomDatePicker\s*value=\{formData\.startDate\}\s*format="YYYY\/MM\/DD"\s*onChange=\{\(date: any\) => setFormData\(\{\.\.\.formData, startDate: date\}\)\}\s*inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"\s*\/>\s*<\/div>/,
    firstInstInput
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
