const fs = require('fs');
const file = 'src/components/modals/PreviewModals.tsx';
let content = fs.readFileSync(file, 'utf8');

// Invoice Modal
content = content.replace(
  'className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none"',
  'className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none print-section"'
);

// Receipt Modal
content = content.replace(
  'className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none" dir="rtl"',
  'className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none print-section" dir="rtl"'
);

// We should also modify the wrapper for Receipt to be A5. A5 landscape is 210mm x 148mm
content = content.replace(
  'className="bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none mx-auto max-w-[210mm] min-h-[297mm] print:w-full print:max-w-none print:min-h-0"',
  'className="bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none mx-auto max-w-[210mm] min-h-[148mm] print:w-full print:max-w-none print:min-h-0"'
);

fs.writeFileSync(file, content);
