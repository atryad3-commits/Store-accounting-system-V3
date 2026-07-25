const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

code = code.replace(/setPreviewReceiptData\(basePayload\);\s*\};\s*const confirmReceiptSubmit = async \(\) => \{\s*if \(!previewReceiptData\) return;/, 
`confirmReceiptSubmit(basePayload);
  };

  const confirmReceiptSubmit = async (payload: any) => {
    if (!payload) return;`);

const startIdx = code.indexOf('const confirmReceiptSubmit = async (payload: any) => {');
const endIdx = code.indexOf('fetchTransactions(),', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  let before = code.substring(0, startIdx);
  let funcBody = code.substring(startIdx, endIdx);
  let after = code.substring(endIdx);
  
  funcBody = funcBody.replace(/previewReceiptData/g, 'payload');
  
  // Oh, wait! setPreviewReceiptData(null) is inside confirmReceiptSubmit
  // If we change it to setpayload(null), it will break. Let's fix that.
  funcBody = funcBody.replace(/setpayload/g, 'setPreviewReceiptData');
  
  code = before + funcBody + after;
  fs.writeFileSync('src/hooks/useAppController.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find bounds", startIdx, endIdx);
}
