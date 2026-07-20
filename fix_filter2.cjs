const fs = require('fs');

// Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const filterStart = appCode.indexOf('const customPersonFilter =');
if (filterStart !== -1) {
    const filterEnd = appCode.indexOf('};', filterStart) + 2;
    appCode = appCode.substring(0, filterStart) + appCode.substring(filterEnd);
}
// replace import
appCode = appCode.replace('import { toPersianDigits, formatNumber, formatCurrency, convertToGregorian, formatDateDisplay } from "./utils/format";', 'import { toPersianDigits, formatNumber, formatCurrency, convertToGregorian, formatDateDisplay, customPersonFilter } from "./utils/format";');
fs.writeFileSync('src/App.tsx', appCode);

// Fix useAppController.tsx
let hookCode = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');
hookCode = hookCode.replace('convertToGregorian,', 'convertToGregorian, customPersonFilter,');
fs.writeFileSync('src/hooks/useAppController.tsx', hookCode);

