const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoanTransitionModal.tsx', 'utf8');

if (!code.includes('import CustomDatePicker')) {
    code = code.replace(
        /import React, \{ useState, useEffect \} from 'react';/,
        `import React, { useState, useEffect } from 'react';\nimport CustomDatePicker from '../ui/CustomDatePicker';\nimport { globalDateFormatter } from '../../utils/dateFormatter';\nimport { convertToGregorian } from '../../utils/format';`
    );
}

// Add state for paymentDate and firstInstallmentDate
if (!code.includes('paymentDate')) {
    code = code.replace(
        /const \[submitting, setSubmitting\] = useState\(false\);/,
        `const [submitting, setSubmitting] = useState(false);\n  const [paymentDate, setPaymentDate] = useState(globalDateFormatter.formatDateOnly(new Date()));\n  const [firstInstallmentDate, setFirstInstallmentDate] = useState(globalDateFormatter.formatDateOnly(new Date()));`
    );
}

// Add the fields to the UI if targetStatus === 'active'
if (!code.includes('تاریخ پرداخت')) {
    code = code.replace(
        /\{eligibility\.requiresReason && \(/,
        `{targetStatus === 'active' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-2 text-sm">تاریخ پرداخت</label>
                      <CustomDatePicker
                         value={paymentDate}
                         format="YYYY/MM/DD"
                         onChange={(val: string) => setPaymentDate(val)}
                         inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2 text-sm">تاریخ اولین سررسید</label>
                      <CustomDatePicker
                         value={firstInstallmentDate}
                         format="YYYY/MM/DD"
                         onChange={(val: string) => setFirstInstallmentDate(val)}
                         inputClass="w-full bg-gray-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}
                {eligibility.requiresReason && (`
    );
}

// update applyTransition call
code = code.replace(
    /const updated = await applyTransition\(loan\.id, targetStatus, userRole, reason\);/,
    `let finalPaymentDate = paymentDate;
      let finalFirstInstDate = firstInstallmentDate;
      if (paymentDate && typeof paymentDate === 'string' && !paymentDate.includes('-')) {
        // Assume it's Shamsi and convert? CustomDatePicker might output strings like 1403/05/20
        // We will pass the Jalali strings to applyTransition and it will handle ISO conversions.
      }
      const updated = await applyTransition(loan.id, targetStatus, userRole, reason, undefined, { paymentDate, firstInstallmentDate });`
);

fs.writeFileSync('src/components/loans/LoanTransitionModal.tsx', code);
