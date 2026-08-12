const fs = require('fs');
let code = fs.readFileSync('src/components/loans/InstallmentBookletPrint.tsx', 'utf8');

if (!code.includes('formatDateDisplay')) {
    code = code.replace(
        /import React,\s*\{.*\} from 'react';/,
        `$& \nimport { formatDateDisplay } from '../../utils/format';`
    );
}

code = code.replace(/\{loan\.startDate\}/g, '{formatDateDisplay(loan.startDate)}');
code = code.replace(/\{inst\.dueDate\}/g, '{formatDateDisplay(inst.dueDate)}');
code = code.replace(/\{inst\.paidDate \? inst\.paidDate : '.......................................'\}/g, "{inst.paidDate ? formatDateDisplay(inst.paidDate) : '.......................................'}");

fs.writeFileSync('src/components/loans/InstallmentBookletPrint.tsx', code);
