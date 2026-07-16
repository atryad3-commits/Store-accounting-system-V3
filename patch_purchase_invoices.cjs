const fs = require('fs');

const files = [
  'src/components/invoices/PurchaseInvoiceCreate.tsx',
  'src/components/invoices/PurchaseReturnInvoiceCreate.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  // Add setIsPersonModalOpen to destructuring
  if (!code.includes('setIsPersonModalOpen,')) {
    code = code.replace(/setInvoiceTitle,/, "setInvoiceTitle, setIsPersonModalOpen,");
  }

  const oldSelect = `<div className="border border-emerald-100 rounded-xl bg-emerald-50/30 focus-within:ring-2 focus-within:ring-emerald-500 transition-colors">
                    <SearchableSelect
                      options={(activePersonsOnly || []).map((p) => ({
                        value: p.id,`;

  const newSelect = `<div className="flex gap-2">
                    <div className="flex-1 border border-emerald-100 rounded-xl bg-emerald-50/30 focus-within:ring-2 focus-within:ring-emerald-500 transition-colors">
                      <SearchableSelect
                        options={(activePersonsOnly || []).map((p) => ({
                          value: p.id,`;

  const oldSelectEnd = `                      onChange={(val) => setCustomerId(val)}
                      placeholder="-- جستجوی تامین کننده --"
                      searchPlaceholder="جستجوی شخص یا شرکت..."
                    />
                  </div>
                  {customerId && (`;

  const newSelectEnd = `                      onChange={(val) => setCustomerId(val)}
                      placeholder="-- جستجوی تامین کننده --"
                      searchPlaceholder="جستجوی شخص یا شرکت..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPersonModalOpen && setIsPersonModalOpen(true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl px-4 flex items-center justify-center transition-colors"
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
