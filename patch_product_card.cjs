const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ProductCardModal.tsx', 'utf8');

code = code.replace(
`import { addCommas, toPersianDigits, formatDateDisplay } from '../../utils/format';`,
`import { addCommas, toPersianDigits, formatDateDisplay, formatAmount } from '../../utils/format';`
);

code = code.replace(
`  const formatCur = (num) => toPersianDigits(addCommas(Math.round(Number(num) || 0)));
  const formatNum = (num) => toPersianDigits(addCommas(Math.round(Number(num)*100)/100 || 0));`,
`  const formatCur = (num) => toPersianDigits(formatAmount(Number(num) || 0, storeSettings));
  const formatNum = (num) => toPersianDigits(formatAmount(Number(num) || 0, storeSettings));`
);

fs.writeFileSync('src/components/modals/ProductCardModal.tsx', code);
console.log('patched ProductCardModal');
