const fs = require('fs');

function cleanSlice(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Removing startProcessing
  code = code.replace(/store\.startProcessing\?\.\("[^"]+"\);\n\s*await new Promise\(r => setTimeout\(r, 400\)\);\n\s*try \{/g, '');
  
  // Removing success message before return
  code = code.replace(/store\.updateProcessingStatus\?\.\("عملیات با موفقیت انجام شد"\);\n\s*await new Promise\(r => setTimeout\(r, 300\)\);\n\s*return/g, 'return');
  
  // Removing finally block
  code = code.replace(/\} finally \{\n\s*store\.stopProcessing\?\.\(\);\n\s*\}/g, '');
  
  // Removing success message without return
  code = code.replace(/store\.updateProcessingStatus\?\.\("عملیات با موفقیت انجام شد"\);\n\s*await new Promise\(r => setTimeout\(r, 300\)\);/g, '');
  
  fs.writeFileSync(file, code);
}

cleanSlice('src/store/slices/receiptSlice.ts');
cleanSlice('src/store/slices/productSlice.ts');
cleanSlice('src/store/slices/warehouseSlice.ts');
cleanSlice('src/store/slices/financialYearSlice.ts');

