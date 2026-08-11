const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add roundingMultiple to state
if (!content.includes('roundingMultiple: number;')) {
    content = content.replace(
        "earlySettlementDiscountPercent: number | '';",
        "earlySettlementDiscountPercent: number | '';\n    roundingMultiple: number;"
    );
    content = content.replace(
        "earlySettlementDiscountPercent: ''\n  });",
        "earlySettlementDiscountPercent: '',\n    roundingMultiple: 1\n  });"
    );
}

// 2. Add helper function outside the component
if (!content.includes('const calculateInstAmount =')) {
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
    // Insert after imports
    content = content.replace(
        "interface LoansManagerProps {",
        helperFn + "interface LoansManagerProps {"
    );
}

// 3. Replace the 4 occurrences of the calculation block with a single function call
const pattern1 = /let r = formData\.interestRate[\s\S]*?instAmt = Math\.round\(amt \/ instCount\)( as any)?;\s*\}/g;
content = content.replace(pattern1, "instAmt = calculateInstAmount(amt, instCount, formData.interestRate, formData.frequency, formData.roundingMultiple) as any;");

const pattern2 = /let r = rate === ''[\s\S]*?instAmt = Math\.round\(amt \/ instCount\);\s*\}/g;
content = content.replace(pattern2, "instAmt = calculateInstAmount(amt, instCount, rate, formData.frequency, formData.roundingMultiple) as any;");

// 4. Inject the Rounding input field right after the Total Installments input
const roundingInput = `
             <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   <Layers className="w-4 h-4 text-gray-400" /> رند کردن اقساط
                </label>
                <select
                  value={formData.roundingMultiple}
                  onChange={(e) => {
                     const rMult = Number(e.target.value);
                     let instAmt = formData.installmentAmount;
                     if (formData.amount && formData.totalInstallments) {
                        instAmt = calculateInstAmount(Number(formData.amount), Number(formData.totalInstallments), formData.interestRate, formData.frequency || 'monthly', rMult);
                     }
                     setFormData({...formData, roundingMultiple: rMult, installmentAmount: instAmt});
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white rounded-xl pr-4 pl-14 py-3 outline-none transition-all font-medium text-slate-800"
                >
                  <option value={1}>بدون رند کردن</option>
                  <option value={100}>رند به ۱۰۰</option>
                  <option value={1000}>رند به ۱,۰۰۰</option>
                  <option value={10000}>رند به ۱۰,۰۰۰</option>
                  <option value={100000}>رند به ۱۰۰,۰۰۰</option>
                  <option value={1000000}>رند به ۱,۰۰۰,۰۰۰</option>
                </select>
             </div>
`;

// Insert the rounding input right after the total installments field container.
// It ends around line 730 `dir="ltr"\n                />\n             </div>`
// We can find `مبلغ هر قسط` and insert just before it.
if (!content.includes('رند کردن اقساط')) {
    content = content.replace(
        '<label className="text-sm font-bold text-gray-700 flex items-center gap-2">\n                   <Activity className="w-4 h-4 text-gray-400" /> مبلغ هر قسط',
        roundingInput.trim() + '\n             <div className="space-y-2">\n                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">\n                   <Activity className="w-4 h-4 text-gray-400" /> مبلغ هر قسط'
    );
}

fs.writeFileSync(file, content);
