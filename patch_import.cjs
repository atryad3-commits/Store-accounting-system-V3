const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /import \{ formatDateDisplay, convertToGregorian \} from '\.\.\/\.\.\/utils\/format';/,
    `import { formatDateDisplay, convertToGregorian } from '../../utils/format';\nimport { globalDateFormatter } from '../../utils/dateFormatter';`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
