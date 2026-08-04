const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/CheckModals.tsx', 'utf8');

// Add props
file = file.replace(
  "icCheckNumber, setIcCheckNumber,",
  "icCheckNumber, setIcCheckNumber,\n    icSayadId, setIcSayadId,\n    icReason, setIcReason,"
);

file = file.replace(
  "rcCheckNumber, setRcCheckNumber,",
  "rcCheckNumber, setRcCheckNumber,\n    rcSayadId, setRcSayadId,\n    rcReason, setRcReason,"
);

// Add form fields to issued modal
const issuedFields = `
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">شناسه صیادی (۱۶ رقم) *</label>
                    <input required type="text" value={icSayadId || ''} onChange={e => setIcSayadId(e.target.value)} pattern="\\d{16}" title="شناسه صیادی باید دقیقاً ۱۶ رقم باشد" className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-center focus:ring-2 focus:ring-indigo-500" dir="ltr" placeholder="1234567890123456" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">بابت *</label>
                    <select required value={icReason || 'خرید کالا'} onChange={e => setIcReason(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                      <option value="خرید کالا">خرید کالا</option>
                      <option value="تسویه بدهی">تسویه بدهی</option>
                      <option value="حقوق و دستمزد">حقوق و دستمزد</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                </div>
`;

file = file.replace(
  /<div className="grid grid-cols-2 gap-4">\s*<div>\s*<label className="block text-xs font-black text-gray-700 mb-1">مبلغ چک \(تومان\) \*/,
  issuedFields + "\n                <div className=\"grid grid-cols-2 gap-4\">\n                  <div>\n                    <label className=\"block text-xs font-black text-gray-700 mb-1\">مبلغ چک (تومان) *"
);

// Add form fields to received modal
const receivedFields = `
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">شناسه صیادی (۱۶ رقم) *</label>
                    <input required type="text" value={rcSayadId || ''} onChange={e => setRcSayadId(e.target.value)} pattern="\\d{16}" title="شناسه صیادی باید دقیقاً ۱۶ رقم باشد" className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-center focus:ring-2 focus:ring-indigo-500" dir="ltr" placeholder="1234567890123456" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">بابت *</label>
                    <select required value={rcReason || 'تسویه بدهی'} onChange={e => setRcReason(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                      <option value="خرید کالا">خرید کالا</option>
                      <option value="تسویه بدهی">تسویه بدهی</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                </div>
`;

file = file.replace(
  /<div>\s*<label className="block text-xs font-black text-gray-700 mb-1">مبلغ چک \(تومان\) \*/,
  receivedFields + "\n                  <div>\n                    <label className=\"block text-xs font-black text-gray-700 mb-1\">مبلغ چک (تومان) *"
);

fs.writeFileSync('src/components/financial/checks/CheckModals.tsx', file);
