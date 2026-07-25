const fs = require('fs');
const file = 'src/components/print/ReceiptPrintTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { toPersianDigits, numToPersianWords, formatCurrency } from '../../utils/format';\nimport { format } from 'date-fns-jalali';",
  "import { toPersianDigits, numToPersianWords } from '../../utils/format';"
);

content = content.replace(
  "export default function ReceiptPrintTemplate({ data, storeSettings, persons, getPersonDisplayName }: any) {",
  "export default function ReceiptPrintTemplate({ data, storeSettings, persons, getPersonDisplayName, formatCurrency }: any) {"
);

content = content.replace(
  "    formattedDate = toPersianDigits(data.date ? format(new Date(data.date), 'yyyy/MM/dd') : '');",
  "    formattedDate = toPersianDigits(data.date ? new Date(data.date).toLocaleDateString('fa-IR') : '');"
);

fs.writeFileSync(file, content);
