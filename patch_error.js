const fs = require('fs');
const file = 'src/components/loans/LoansManager.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                        if (formData.totalInstallments) {
                           let r = formData.interestRate === '' ? 0 : Number(formData.interestRate);
                           let instCount = Number(formData.totalInstallments);
                           let freq = formData.frequency || 'monthly';
                           let periodsPerYear = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;
                        let r = formData.interestRate === '' ? 0 : Number(formData.interestRate);
                        let instCount = Number(formData.totalInstallments);
                        instAmt = calculateInstallment(amt, instCount, r, freq, formData.roundingBase) as any;
                     }`;

const replacement = `                        if (formData.totalInstallments) {
                           let r = formData.interestRate === '' ? 0 : Number(formData.interestRate);
                           let instCount = Number(formData.totalInstallments);
                           let freq = formData.frequency || 'monthly';
                           instAmt = calculateInstallment(amt, instCount, r, freq, formData.roundingBase) as any;
                        }`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
