const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add roundingMultiple to form state
content = content.replace(
    "earlySettlementDiscountPercent: number | '';",
    "earlySettlementDiscountPercent: number | '';\n    roundingMultiple: number;"
);
content = content.replace(
    "earlySettlementDiscountPercent: ''\n  });",
    "earlySettlementDiscountPercent: '',\n    roundingMultiple: 1\n  });"
);

// We need a helper to calculate installment amount based on rounding.
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
    // apply rounding
    if (rounding > 1) {
       return Math.ceil(rawInstAmt / rounding) * rounding;
    }
    return Math.round(rawInstAmt);
  };
`;
// Let's insert the helper inside the LoansManager component just after state initialization
content = content.replace(
    "const selectedPersonBalance = React.useMemo(() => {",
    helperFn + "\n  const selectedPersonBalance = React.useMemo(() => {"
);

fs.writeFileSync(file, content);
