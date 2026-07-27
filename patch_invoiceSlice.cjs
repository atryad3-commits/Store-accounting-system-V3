const fs = require('fs');
let code = fs.readFileSync('src/store/slices/invoiceSlice.ts', 'utf8');

const replacement = `  addInvoice: async (invoiceData, skipRecalc = false) => {
    const store = get() as any;
    store.updateProcessingStatus?.("ثبت فاکتور در پایگاه داده...");
    const created = await addInvoice(invoiceData, skipRecalc);
    store.updateProcessingStatus?.("بروزرسانی کش سیستم...");
    await get().fetchInvoices();
    return created;
  },
  updateInvoice: async (id, updatedData, skipRecalc = false) => {
    const store = get() as any;
    store.updateProcessingStatus?.("ثبت تغییرات فاکتور...");
    const updated = await updateInvoice(id, updatedData, skipRecalc);
    store.updateProcessingStatus?.("بروزرسانی کش سیستم...");
    await get().fetchInvoices();
    return updated;
  },
  deleteInvoice: async (id, forceDelete = false, skipRecalc = false) => {
    const store = get() as any;
    store.updateProcessingStatus?.("حذف فاکتور...");
    await deleteInvoice(id, forceDelete, skipRecalc);
    store.updateProcessingStatus?.("بروزرسانی کش سیستم...");
    await get().fetchInvoices();
  },`;

code = code.replace(/  addInvoice: async \(invoiceData, skipRecalc = false\) => \{[\s\S]*?deleteInvoice: async \(id, forceDelete = false, skipRecalc = false\) => \{[\s\S]*?await get\(\)\.fetchInvoices\(\);\n      store\.updateProcessingStatus\?\.\("عملیات با موفقیت انجام شد"\);\n      await new Promise\(r => setTimeout\(r, 300\)\);\n    \} finally \{\n      store\.stopProcessing\?\.\(\);\n    \}\n  \},/, replacement);
fs.writeFileSync('src/store/slices/invoiceSlice.ts', code);
