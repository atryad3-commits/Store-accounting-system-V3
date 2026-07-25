const fs = require('fs');
const file = 'src/components/print/ReceiptPrintTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `<style>
        @media print {
          @page { size: A5 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>`,
  `<style dangerouslySetInnerHTML={{__html: \`
        @media print {
          @page { size: A5 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      \`}} />`
);

fs.writeFileSync(file, content);
