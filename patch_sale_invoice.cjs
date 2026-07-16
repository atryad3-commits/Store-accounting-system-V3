const fs = require('fs');
let code = fs.readFileSync('src/components/invoices/SaleInvoiceCreate.tsx', 'utf-8');

// Add setIsPersonModalOpen to destructuring
code = code.replace(/setInvoiceTitle,/, "setInvoiceTitle, setIsPersonModalOpen,");

// Add button next to SearchableSelect for customer
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
                      title="تعریف مشتری جدید"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                  {customerId && (`;

code = code.replace(oldSelect, newSelect);
code = code.replace(oldSelectEnd, newSelectEnd);

fs.writeFileSync('src/components/invoices/SaleInvoiceCreate.tsx', code, 'utf-8');
console.log('Patched SaleInvoiceCreate.');
