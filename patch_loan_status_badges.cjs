const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const statusVars = `
const LOAN_STATUS_LABELS: Record<string, string> = {
  requested: 'درخواست',
  incomplete: 'نقص پرونده',
  completed_dossier: 'تکمیل پرونده',
  approved: 'تایید شده',
  active: 'پرداخت شده',
  completed: 'تسویه شده',
  overdue: 'معوق'
};
const LOAN_STATUS_COLORS: Record<string, string> = {
  requested: 'bg-slate-100 text-slate-700',
  incomplete: 'bg-rose-100 text-rose-700',
  completed_dossier: 'bg-sky-100 text-sky-700',
  approved: 'bg-purple-100 text-purple-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-200 text-slate-800',
  overdue: 'bg-red-100 text-red-800'
};
`;

if (!code.includes('LOAN_STATUS_LABELS')) {
    code = code.replace("export default function LoansManager({", statusVars + "\nexport default function LoansManager({");
}

code = code.replace(
    /\{loan\.status === 'completed' && <span className="bg-gray-100 text-gray-600 px-2\.5 py-1 rounded-lg text-xs font-black">تسویه شده<\/span>\}/g,
    `<span className={\`px-2.5 py-1 rounded-lg text-xs font-black \$\{LOAN_STATUS_COLORS[loan.status] || 'bg-gray-100 text-gray-600'\}\`}>{LOAN_STATUS_LABELS[loan.status] || 'نامشخص'}</span>`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
