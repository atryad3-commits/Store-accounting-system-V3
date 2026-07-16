const fs = require('fs');

const files = [
  'src/components/invoices/PurchaseInvoiceCreate.tsx',
  'src/components/invoices/PurchaseReturnInvoiceCreate.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');

  // Let's find the closing tag. Since I already replaced the opening tag, there is a `flex gap-2` and `flex-1`.
  // We need to find:
  //                     />
  //                   </div>
  //                   {customerId &&
  // And replace it with the proper structure.

  const oldText = `                      onChange={(val) => setCustomerId(val)}
                      placeholder="-- جستجوی تامین کننده --"
                      searchPlaceholder="جستجوی شخص یا شرکت..."
                    />
                  </div>
                  {customerId &&`;

  const newText = `                      onChange={(val) => setCustomerId(val)}
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
                {customerId &&`;

  if (code.includes(oldText)) {
    code = code.replace(oldText, newText);
    fs.writeFileSync(file, code, 'utf-8');
    console.log('Fixed', file);
  } else {
    console.log('Could not find in', file);
  }
}
