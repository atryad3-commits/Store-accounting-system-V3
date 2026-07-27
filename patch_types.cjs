const fs = require('fs');
let content = fs.readFileSync('src/components/print/invoice-templates/InvoicePrintTypes.ts', 'utf8');

content = content.replace(
  `printSettings?: any;`,
  `printSettings?: any;
  paperSize?: "a4" | "a5";`
);

fs.writeFileSync('src/components/print/invoice-templates/InvoicePrintTypes.ts', content);
console.log("Patched Types");
