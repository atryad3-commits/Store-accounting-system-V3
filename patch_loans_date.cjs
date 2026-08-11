const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    `<CustomDatePicker
                   value={formData.startDate}
                   onChange={(val: string) => setFormData({...formData, startDate: val})}
                 />`,
    `<CustomDatePicker
                   value={formData.startDate}
                   format="YYYY/MM/DD"
                   onChange={(val: string) => setFormData({...formData, startDate: val})}
                 />`
);

fs.writeFileSync(file, content);
