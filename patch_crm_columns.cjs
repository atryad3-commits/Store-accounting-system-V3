const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const newCode = `export const getCrmColumns = async () => {
  return await getLocalData('crm_columns', [
    { id: 'initial', title: 'تماس اولیه', color: 'bg-slate-100', borderColor: 'border-slate-200', titleColor: 'text-slate-700' },
    { id: 'promised', title: 'وعده پرداخت', color: 'bg-amber-50', borderColor: 'border-amber-200', titleColor: 'text-amber-700' },
    { id: 'legal', title: 'اقدام قانونی', color: 'bg-rose-50', borderColor: 'border-rose-200', titleColor: 'text-rose-700' },
    { id: 'paid', title: 'تسویه شده', color: 'bg-emerald-50', borderColor: 'border-emerald-200', titleColor: 'text-emerald-700' },
    { id: 'failed', title: 'عدم وصول', color: 'bg-gray-100', borderColor: 'border-gray-300', titleColor: 'text-gray-600' }
  ]);
};

export const saveCrmColumns = async (data: any[]) => {
  await setLocalData('crm_columns', data);
};

export const getDebtorsTrackings`;

code = code.replace('export const getDebtorsTrackings', newCode);
fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Patched dataService.ts');
