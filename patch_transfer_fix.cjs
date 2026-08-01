const fs = require('fs');
const file = 'src/components/financial/FinancialTransfer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { convertPersianToEnglishNumbers } from '../../utils/format';",
  ""
);

content = content.replace(
  "const amount = Number(convertPersianToEnglishNumbers(amountStr || '').replace(/,/g, ''));",
  "const amount = Number((amountStr || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/,/g, ''));"
);

fs.writeFileSync(file, content);
