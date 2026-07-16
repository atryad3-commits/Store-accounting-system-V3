const fs = require('fs');

const files = [
  'src/components/invoices/SaleReturnInvoiceCreate.tsx',
  'src/components/invoices/PurchaseInvoiceCreate.tsx',
  'src/components/invoices/PurchaseReturnInvoiceCreate.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  // Add setIsPersonModalOpen to destructuring
  if (!code.includes('setIsPersonModalOpen,')) {
    code = code.replace(/setInvoiceTitle,/, "setInvoiceTitle, setIsPersonModalOpen,");
  }

  const oldSelect = `<div className="border border-indigo-100 rounded-xl bg-indigo-50/30 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors">
                    <SearchableSelect
                      options={(activePersonsOnly || []).map((p) => ({
                        value: p.id,`;

  const newSelect = `<div className="flex gap-2">
                    <div className="flex-1 border border-indigo-100 rounded-xl bg-indigo-50/30 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors">
                      <SearchableSelect
                        options={(activePersonsOnly || []).map((p) => ({
                          value: p.id,`;

  const oldSelectEnd = `                      onChange={(val) => setCustomerId(val)}
                    />
                  </div>
                  {customerId && (`;

  const newSelectEnd = `                      onChange={(val) => setCustomerId(val)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPersonModalOpen && setIsPersonModalOpen(true)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl px-4 flex items-center justify-center transition-colors"
                      title="تعریف شخص جدید"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                  {customerId && (`;

  if (code.includes(oldSelect)) {
    code = code.replace(oldSelect, newSelect);
    code = code.replace(oldSelectEnd, newSelectEnd);
    fs.writeFileSync(file, code, 'utf-8');
    console.log('Patched', file);
  } else {
    console.log('Could not find pattern in', file);
  }
}
