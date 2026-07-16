const fs = require('fs');
const files = [
  'src/components/financial/PayReceiptModal.tsx',
  'src/components/financial/ReceiveReceiptModal.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  code = code.replace(
    /<div className="fixed inset-0 z-\[100\] [^>]+>\s*<motion\.div[^>]+className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-\[90vh\] overflow-hidden relative"\s*>/g,
    '<div className="w-full font-sans" dir="rtl">\n<div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full flex flex-col overflow-hidden relative">'
  );

  code = code.replace(
    /<button[^>]*onClick={onClose}[^>]*>[\s\S]*?<X className="w-5 h-5" \/>\s*<\/button>/,
    ''
  );

  code = code.replace(/<\/motion\.div>/g, '</div>');

  code = code.replace(/className="p-6 overflow-y-auto space-y-6"/g, 'className="p-6 space-y-6"');
  
  code = code.replace(/if \(!isOpen\) return null;/g, '');

  fs.writeFileSync(file, code, 'utf-8');
  console.log(`Converted ${file}`);
}
