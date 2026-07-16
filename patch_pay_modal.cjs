const fs = require('fs');
let code = fs.readFileSync('src/components/financial/PayReceiptModal.tsx', 'utf-8');

if (!code.includes('import { getIssuedChecks }')) {
  code = code.replace(
    'import React from "react";',
    'import React, { useState, useEffect } from "react";\nimport { getIssuedChecks } from "../../services/dataService";'
  );
}

if (!code.includes('const [nearbyChecks, setNearbyChecks]')) {
  const insertIndex = code.indexOf('const isReceive = false;');
  const insertCode = `
  const [nearbyChecks, setNearbyChecks] = useState<any[]>([]);
  useEffect(() => {
    if (receiptMethod === 'check' && receiptCheckDueDate) {
      // Calculate +/- 30 days
      const fetchChecks = async () => {
        try {
          const allChecks = await getIssuedChecks();
          
          let targetTime = 0;
          if (receiptCheckDueDate?.toDate) {
            targetTime = receiptCheckDueDate.toDate().getTime();
          } else if (typeof receiptCheckDueDate === 'string' || typeof receiptCheckDueDate === 'number') {
            targetTime = new Date(receiptCheckDueDate).getTime();
          }
          
          if (!targetTime || isNaN(targetTime)) return;
          
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          const minTime = targetTime - thirtyDaysMs;
          const maxTime = targetTime + thirtyDaysMs;
          
          const nearby = allChecks.filter(c => {
            if (!c.dueDate) return false;
            const checkTime = new Date(c.dueDate).getTime();
            return checkTime >= minTime && checkTime <= maxTime;
          });
          
          setNearbyChecks(nearby);
        } catch(e) {
          console.error(e);
        }
      };
      fetchChecks();
    } else {
      setNearbyChecks([]);
    }
  }, [receiptCheckDueDate, receiptMethod]);
  
`;
  code = code.slice(0, insertIndex) + insertCode + code.slice(insertIndex);
}

// We need to inject the UI for nearbyChecks just below the dueDate picker.
// Let's find the dueDate picker for check.
const datePickerCode = `<DatePicker
                            value={receiptCheckDueDate}
                            onChange={setReceiptCheckDueDate}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass={\`w-full px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 \${themeRing} outline-none font-sans font-black text-slate-900 text-center transition-all cursor-pointer shadow-sm text-sm\`}
                          />`;
                          
const uiToInsert = `
                          {nearbyChecks.length > 0 && (
                            <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs">
                              <p className="font-bold text-indigo-800 mb-1">چک‌های صادره هم‌زمان (±۳۰ روز):</p>
                              <ul className="space-y-1 max-h-32 overflow-y-auto">
                                {nearbyChecks.map(c => (
                                  <li key={c.id} className="flex justify-between items-center text-slate-600 border-b border-indigo-100/50 pb-1">
                                    <span>مبلغ: {formatNumber(c.amount)}</span>
                                    <span className="text-slate-500">{new Date(c.dueDate).toLocaleDateString('fa-IR')}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
`;

code = code.replace(datePickerCode, datePickerCode + uiToInsert);

fs.writeFileSync('src/components/financial/PayReceiptModal.tsx', code, 'utf-8');
console.log('PayReceiptModal patched');
