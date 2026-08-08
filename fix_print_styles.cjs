const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansPayment.tsx', 'utf8');

const oldPrint = `<div ref={bookletRef} className="p-8 font-sans" dir="rtl" style={{ width: '100%' }}>`;
const newPrint = `<div ref={bookletRef} className="p-8 font-sans print:w-[148mm] print:h-[210mm] mx-auto print:p-6" dir="rtl" style={{ width: '100%', maxWidth: '210mm' }}>
              <style>
                {\`
                  @media print {
                    @page { size: A5; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  }
                \`}
              </style>`;
code = code.replace(oldPrint, newPrint);

const oldItem = `<div key={inst.id} className="border-2 border-gray-800 rounded-xl p-4 flex flex-col justify-between" style={{ breakInside: 'avoid' }}>`;
const newItem = `<div key={inst.id} className="border-2 border-gray-400 rounded-xl p-4 flex flex-col justify-between bg-white h-[120px] shadow-sm print:shadow-none" style={{ breakInside: 'avoid' }}>`;
code = code.replace(oldItem, newItem);

fs.writeFileSync('src/components/loans/LoansPayment.tsx', code);
