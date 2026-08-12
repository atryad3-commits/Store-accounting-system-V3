const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /startDate: new Date\(\)\.toISOString\(\)/g,
    `startDate: globalDateFormatter.formatDateOnly(new Date())`
);
code = code.replace(
    /paymentDate: new Date\(\)\.toISOString\(\)/g,
    `paymentDate: globalDateFormatter.formatDateOnly(new Date())`
);

// Add import if not exists
if (!code.includes('globalDateFormatter')) {
    code = code.replace(
        /import \{ formatDateDisplay, convertToGregorian \} from '\.\.\/\.\.\/utils\/format';/,
        `import { formatDateDisplay, convertToGregorian } from '../../utils/format';\nimport { globalDateFormatter } from '../../utils/dateFormatter';`
    );
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
