const fs = require('fs');

function cleanSlice(file, handlers) {
  let code = fs.readFileSync(file, 'utf8');
  for (const handler of handlers) {
     const regex = new RegExp(\`  \${handler}: async \\\\([a-zA-Z0-9_, =]*\\\\) => \\\\{[\\\\s\\\\S]*?return [a-zA-Z0-9_]+;[\\\\s]*\\\\} finally \\\\{[\\\\s]*store\\\\.stopProcessing\\\\?\\\\.\\\\(\\\\);[\\\\s]*\\\\}[\\\\s]*\\\\},\`, 'g');
     // Actually a simpler way is to just replace the whole body of the function. Let's do regex to remove store.startProcessing, and stopProcessing
  }
  
  code = code.replace(/store\.startProcessing\?\.\("[^"]+"\);\n\s*await new Promise\(r => setTimeout\(r, 400\)\);\n\s*try \{/g, '');
  
  code = code.replace(/store\.updateProcessingStatus\?\.\("عملیات با موفقیت انجام شد"\);\n\s*await new Promise\(r => setTimeout\(r, 300\)\);\n\s*return/g, 'return');
  
  code = code.replace(/\} finally \{\n\s*store\.stopProcessing\?\.\(\);\n\s*\}/g, '');
  
  code = code.replace(/store\.updateProcessingStatus\?\.\("عملیات با موفقیت انجام شد"\);\n\s*await new Promise\(r => setTimeout\(r, 300\)\);/g, '');
  
  fs.writeFileSync(file, code);
}

cleanSlice('src/store/slices/receiptSlice.ts', ['addTransaction', 'updateTransaction', 'deleteTransaction']);
cleanSlice('src/store/slices/productSlice.ts', ['addProduct', 'updateProduct', 'deleteProduct']);
cleanSlice('src/store/slices/warehouseSlice.ts', ['addWarehouse', 'updateWarehouse', 'deleteWarehouse']);
cleanSlice('src/store/slices/financialYearSlice.ts', ['addFinancialYear', 'updateFinancialYear', 'deleteFinancialYear']);

