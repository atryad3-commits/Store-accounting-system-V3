const fs = require('fs');
const file = 'src/components/print/ReceiptPrintTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{getPersonDisplayName(data.personId, persons)}',
  '{getPersonDisplayName(persons?.find((p: any) => p.id?.toString() === data.personId?.toString()))}'
);

content = content.replace(
  '<div className="w-full bg-white p-8 text-slate-800 font-sans" dir="rtl">',
  `<style>
        @media print {
          @page { size: A5 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    <div className="w-full bg-white p-8 text-slate-800 font-sans" dir="rtl">`
);

fs.writeFileSync(file, content);
