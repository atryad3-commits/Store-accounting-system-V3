const fs = require('fs');
const content = fs.readFileSync('src/components/warehouses/WarehouseDocCreate.tsx', 'utf8');

const target = `                      <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm font-bold text-amber-800 flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="deletePrev"
                          checked={deletePreviousDocs}
                          onChange={(e) =>
                            setDeletePreviousDocs(e.target.checked)
                          }
                          className="mt-1 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="deletePrev" className="cursor-pointer">
                          حذف حواله‌های انبار قبلی برای این فاکتور (تنظیم مجدد
                          رسید/حواله)
                        </label>
                      </div>`;

const replacement = `                      {sourceInvoiceId && (() => {
                        const pastDocs = (invoices || []).filter(
                          (i) => i.sourceInvoiceId?.toString() === sourceInvoiceId?.toString() && i.status !== "voided" && i.status !== "draft" && !i.isDraft &&
                          (isReceipt ? i.type === "warehouse_receipt" : i.type === "warehouse_remittance")
                        );
                        if (pastDocs.length > 0) {
                          return (
                            <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <h3 className="font-bold text-amber-800 mb-3 text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                اسناد انبار قبلی برای این فاکتور:
                              </h3>
                              <div className="space-y-2">
                                {pastDocs.map((doc: any) => (
                                  <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                                    <span className="text-sm text-gray-700 font-medium">شماره سند: {doc.invoiceNumber} - تاریخ: {doc.date}</span>
                                    <button onClick={() => {
                                      if (handleVoidInvoice) {
                                        handleVoidInvoice(doc.id);
                                      }
                                    }} className="text-red-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">ابطال سند</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/warehouses/WarehouseDocCreate.tsx', content.replace(target, replacement));
  console.log('Patched successfully');
} else {
  console.log('Target not found');
}
