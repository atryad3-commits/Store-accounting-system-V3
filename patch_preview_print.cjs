const fs = require('fs');
let content = fs.readFileSync('src/components/modals/PreviewModals.tsx', 'utf8');

// Inside previewInvoiceData, add a print button
content = content.replace(
  `<button
                  onClick={() => {
                    saveInvoiceData(previewInvoiceData);
                    setPreviewInvoiceData(null);
                  }}`,
  `<button onClick={() => window.print()} className="px-6 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                   چاپ پیش‌نمایش
                 </button>
                 <button
                  onClick={() => {
                    saveInvoiceData(previewInvoiceData);
                    setPreviewInvoiceData(null);
                  }}`
);

fs.writeFileSync('src/components/modals/PreviewModals.tsx', content);
console.log("Patched print button");
