const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

code = code.replace(
    /import \{ generateInstallmentCode \} from '\.\.\/utils\/installmentUtils';/,
    `import { generateInstallmentCode, calculateInstallmentDates } from '../utils/installmentUtils';\nimport { globalDateFormatter } from '../utils/dateFormatter';`
);

code = code.replace(
    /const stepMonths = loan\.frequency === 'yearly' \? 12 : loan\.frequency === 'quarterly' \? 3 : 1;[\s\S]*?inst\.installmentCode = generateInstallmentCode\(loanId, loan\.loanNumber, idx, gregorianDueDate\);\n\s*\}\);/,
    `const calendarType = globalDateFormatter.getConfig().calendarType === 'jalali' ? 'jalali' : 'gregorian';
      const firstDateIso = convertToGregorian(dates.firstInstallmentDate).split('T')[0];
      const newDates = calculateInstallmentDates(firstDateIso, loanInst.length, loan.frequency || 'monthly', calendarType);
      
      loanInst.forEach((inst: any, idx: number) => {
          inst.dueDate = newDates[idx];
          inst.installmentCode = generateInstallmentCode(loanId, loan.loanNumber, idx, newDates[idx]);
      });`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
