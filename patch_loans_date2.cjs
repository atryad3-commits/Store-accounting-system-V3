const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    `<CustomDatePicker
                   value={formData.startDate}
                   format="YYYY/MM/DD"
                   onChange={(val: string) => setFormData({...formData, startDate: val})}
                 />`,
    `<CustomDatePicker
                   value={formData.startDate}
                   format="YYYY/MM/DD"
                   onChange={(val: string) => setFormData({...formData, startDate: val})}
                   inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"
                   containerClassName="w-full"
                 />`
);

fs.writeFileSync(file, content);
