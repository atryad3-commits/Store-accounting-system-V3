const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    "earlySettlementDiscountPercent: number | '';",
    "earlySettlementDiscountPercent: number | '';\n    roundingMultiple: number;"
);
content = content.replace(
    "earlySettlementDiscountPercent: ''\n  });",
    "earlySettlementDiscountPercent: '',\n    roundingMultiple: 1\n  });"
);

const helperFn = `
  const calculateInstAmount = (amt, instCount, rate, freq, rounding) => {
    let r = rate === '' ? 0 : Number(rate);
    let periodsPerYear = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;
    let periodicRate = (r / 100) / periodsPerYear;
    let rawInstAmt = 0;
    if (periodicRate > 0) {
        rawInstAmt = (amt * periodicRate * Math.pow(1 + periodicRate, instCount)) / (Math.pow(1 + periodicRate, instCount) - 1);
    } else {
        rawInstAmt = amt / instCount;
    }
    if (rounding > 1) {
       return Math.ceil(rawInstAmt / rounding) * rounding;
    }
    return Math.round(rawInstAmt);
  };
`;

content = content.replace(
    "const selectedPersonBalance = React.useMemo(() => {",
    helperFn + "\n  const selectedPersonBalance = React.useMemo(() => {"
);

// We have 4 identical blocks for the calculation in onChange handlers:
const regex = /let r = formData\.interestRate === '' \? 0 : Number\([\s\S]*?instAmt = Math\.round\(amt \/ instCount\)( as any)?;\s*\}/g;
content = content.replace(regex, "instAmt = calculateInstAmount(amt, instCount, formData.interestRate || rate || '', formData.frequency || freq || 'monthly', formData.roundingMultiple);");

fs.writeFileSync(file, content);
