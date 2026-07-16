const fs = require('fs');

const files = [
  'src/components/invoices/SaleInvoiceCreate.tsx',
  'src/components/invoices/SaleReturnInvoiceCreate.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  // Find the exact line: onChange={(val) => setCustomerId(val)}
  // and the following lines.
  const oldText = `                      onChange={(val) => setCustomerId(val)}
                      placeholder="-- جستجوی مشتری --"
                      searchPlaceholder="جستجوی شخص یا شرکت..."
                    />
                  </div>
                  {customerId &&`;

  const newText = `                      onChange={(val) => setCustomerId(val)}
                      placeholder="-- جستجوی مشتری --"
                      searchPlaceholder="جستجوی شخص یا شرکت..."
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
                {customerId &&`;

  if (code.includes(oldText)) {
    code = code.replace(oldText, newText);
    fs.writeFileSync(file, code, 'utf-8');
    console.log('Fixed', file);
  } else {
    console.log('Could not find in', file);
  }
}
