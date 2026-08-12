const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const replacement = `
    const r = formData.interestRate === '' ? 0 : Number(formData.interestRate);
    let targetTotalPayable = amountNum;
    let exactInstAmt = amountNum / instCount;

    if (r > 0) {
        let freq = formData.frequency || 'monthly';
        let periodsPerYear = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;
        let periodicRate = (r / 100) / periodsPerYear;
        exactInstAmt = (amountNum * periodicRate * Math.pow(1 + periodicRate, instCount)) / (Math.pow(1 + periodicRate, instCount) - 1);
        targetTotalPayable = Math.round(exactInstAmt * instCount);
    }
    
    // Determine the calendar type and calculate dates
    const calendarType = globalDateFormatter.getConfig().calendarType === 'jalali' ? 'jalali' : 'gregorian';
    const firstDateIso = convertToGregorian(formData.startDate).split('T')[0];
    const newDates = calculateInstallmentDates(firstDateIso, instCount + 1, formData.frequency || 'monthly', calendarType);
    // newDates[0] is the start date. Installments start from index 1.

    const newInstallments: Installment[] = [];
    let accumulated = 0;

    for (let i = 0; i < instCount; i++) {
      let expectedAccumulated = (i + 1) * exactInstAmt;
      
      if (formData.roundingBase > 0) {
         expectedAccumulated = Math.round(expectedAccumulated / formData.roundingBase) * formData.roundingBase;
      } else {
         expectedAccumulated = Math.round(expectedAccumulated);
      }
      
      if (i === instCount - 1) {
          expectedAccumulated = targetTotalPayable; // The final must exactly match total payable
      }

      let currentInstAmount = expectedAccumulated - accumulated;
      accumulated = expectedAccumulated;
      
      let gregorianDueDate = newDates[i + 1];

      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        installmentNumber: i + 1,
        loanId: loanId,
        dueDate: gregorianDueDate,
        amount: currentInstAmount,
        status: 'pending',
        installmentCode: generateInstallmentCode(loanId, newLoan.loanNumber, i, gregorianDueDate),
      });
    }`;

code = code.replace(/let \[initY, initM, initD\] = toEnglishNumbers\(formData\.startDate\)[\s\S]*?installmentCode: generateInstallmentCode\(loanId, newLoan\.loanNumber, i, gregorianDueDate\),\n\s*\}\);\n\s*\}/, replacement);

if (!code.includes('calculateInstallmentDates')) {
    code = code.replace(
        /import \{ generateInstallmentCode \} from '\.\.\/\.\.\/utils\/installmentUtils';/,
        `import { generateInstallmentCode, calculateInstallmentDates } from '../../utils/installmentUtils';`
    );
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
