const fs = require('fs');
const file = 'src/components/modals/PreviewModals.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import WarehousePrintTemplate from "../print/WarehousePrintTemplate";',
  'import WarehousePrintTemplate from "../print/WarehousePrintTemplate";\nimport ReceiptPrintTemplate from "../print/ReceiptPrintTemplate";'
);

content = content.replace(
  'transactions, invoices, personOpeningBalances, issuedChecks, receivedChecks',
  'transactions, invoices, personOpeningBalances, issuedChecks, receivedChecks, printingTransaction, setPrintingTransaction'
);

const newModal = `      {/* Receipt Printing Modal */}
      {printingTransaction && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none" dir="rtl">
          <div className="flex-1 w-full max-w-3xl mx-auto my-0 sm:my-4 bg-slate-100 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden print:w-full print:max-w-none print:m-0 print:rounded-none print:shadow-none print:bg-white relative">
            <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden shrink-0 z-10">
              <h3 className="text-lg font-black text-slate-800">پیش‌نمایش چاپ رسید</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors font-bold flex gap-2 px-4 items-center">
                  <Printer className="w-5 h-5" />
                  چاپ
                </button>
                <button onClick={() => setPrintingTransaction(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 sm:p-8 print:p-0 relative">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none mx-auto max-w-[210mm] min-h-[297mm] print:w-full print:max-w-none print:min-h-0">
                  <ReceiptPrintTemplate
                    data={printingTransaction}
                    storeSettings={storeSettings}
                    persons={persons}
                    formatCurrency={formatCurrency}
                    getPersonDisplayName={getPersonDisplayName}
                  />
               </div>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  '    </>\n  );\n}',
  newModal + '    </>\n  );\n}'
);

fs.writeFileSync(file, content);
