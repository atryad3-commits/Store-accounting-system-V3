const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

code = code.replace(
    /export async function applyTransition\([\s\S]*?\)\s*\{/,
    `import { getInstallments, saveInstallments } from './db';\nimport { convertToGregorian } from '../utils/format';\nimport { toEnglishNumbers } from '../utils/format';\n\nexport async function applyTransition(
  loanId: string | number, 
  targetStatus: Loan['status'], 
  userRole: string, 
  reason?: string,
  userId?: string,
  dates?: { paymentDate: string, firstInstallmentDate: string }
) {`
);

// We also need to find where updatedLoan is defined and add paymentDate, firstInstallmentDate.
code = code.replace(
    /const updatedLoan = \{\s*\.\.\.loan,\s*status: targetStatus\s*\};/,
    `const updatedLoan = { 
     ...loan, 
     status: targetStatus,
     ...(dates && targetStatus === 'active' ? { 
         paymentDate: convertToGregorian(dates.paymentDate).split('T')[0],
         firstInstallmentDate: convertToGregorian(dates.firstInstallmentDate).split('T')[0]
     } : {})
  };

  if (dates && targetStatus === 'active') {
      // Recalculate installments based on firstInstallmentDate
      const allInst = await getInstallments();
      const loanInst = allInst.filter((i: any) => i.loanId === loanId).sort((a: any, b: any) => a.installmentNumber - b.installmentNumber);
      
      let [initY, initM, initD] = toEnglishNumbers(dates.firstInstallmentDate).replace(/\\//g, '-').split('-').map(Number);
      if (isNaN(initY)) {
          // fallback to ISO split
          const iso = convertToGregorian(dates.firstInstallmentDate).split('T')[0];
          const parts = iso.split('-');
          // Wait, initY/M/D needs to be Jalali so stepMonths logic works nicely, but convertToGregorian takes Jalali. 
          // If the user picked a Jalali date, toEnglishNumbers.replace... works.
      }
      
      const stepMonths = loan.frequency === 'yearly' ? 12 : loan.frequency === 'quarterly' ? 3 : 1;
      
      loanInst.forEach((inst: any, idx: number) => {
          let totalMonths = initM + (idx * stepMonths); // idx=0 is firstInstallmentDate itself
          let instY = initY + Math.floor((totalMonths - 1) / 12);
          let instM = ((totalMonths - 1) % 12) + 1;
          
          let finalD = initD;
          if (instM === 12 && finalD > 29) finalD = 29;
          if (instM > 6 && finalD === 31) finalD = 30;
          let dueDateStr = instY + '/' + instM.toString().padStart(2, '0') + '/' + finalD.toString().padStart(2, '0');
          
          inst.dueDate = convertToGregorian(dueDateStr).split('T')[0];
      });
      
      const otherInst = allInst.filter((i: any) => i.loanId !== loanId);
      await saveInstallments([...otherInst, ...loanInst]);
  }`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
