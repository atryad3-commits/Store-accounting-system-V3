const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const oldDisplay1 = `{new Date(note.date).toLocaleDateString('fa-IR')}`;
const newDisplay1 = `{storeSettings?.calendarType === 'gregorian' ? new Date(note.date).toLocaleDateString('en-US') : new Date(note.date).toLocaleDateString('fa-IR')}`;

const oldDisplay2 = `<span className="font-sans">{item.nextActionDate}</span>`;
const newDisplay2 = `<span className="font-sans">{storeSettings?.calendarType === 'gregorian' ? new Date(item.nextActionDate).toLocaleDateString('en-US') : new Date(item.nextActionDate).toLocaleDateString('fa-IR')}</span>`;

if (code.includes(oldDisplay1)) {
    code = code.replace(oldDisplay1, newDisplay1);
}
if (code.includes(oldDisplay2)) {
    code = code.replace(oldDisplay2, newDisplay2);
}

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Patched date displays');
