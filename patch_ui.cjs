const fs = require('fs');
const content = fs.readFileSync('src/components/invoices/InvoicesList.tsx', 'utf8');

const target = `                {activeTab === "list_warehouse_docs" && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto">
                    <button
                      onClick={() => setListFilter("all")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      همه اسناد
                    </button>
                    <button
                      onClick={() => setListFilter("receipt")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "receipt" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      ⬇️ رسید (ورود)
                    </button>
                    <button
                      onClick={() => setListFilter("remittance")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "remittance" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      ⬆️ حواله (خروج)
                    </button>
                  </div>
                )}`;

const replacement = `                {activeTab === "list_warehouse_docs" && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto">
                    <button
                      onClick={() => setListFilter("all")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      همه اسناد
                    </button>
                    <button
                      onClick={() => setListFilter("receipt")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "receipt" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      ⬇️ رسید (ورود)
                    </button>
                    <button
                      onClick={() => setListFilter("remittance")}
                      className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 \${listFilter === "remittance" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}
                    >
                      ⬆️ حواله (خروج)
                    </button>
                  </div>
                )}
                {activeTab === "list_sale" && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto">
                    <button onClick={() => setInvoiceTabFilter("all")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      همه موارد
                    </button>
                    <button onClick={() => setInvoiceTabFilter("sale")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "sale" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      فقط فاکتورها
                    </button>
                    <button onClick={() => setInvoiceTabFilter("proforma")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "proforma" ? "bg-slate-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      فقط پیش‌فاکتورها
                    </button>
                    <button onClick={() => setInvoiceTabFilter("remitted")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "remitted" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      حواله شده
                    </button>
                    <button onClick={() => setInvoiceTabFilter("paid")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "paid" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      تسویه شده
                    </button>
                    <button onClick={() => setInvoiceTabFilter("unpaid")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "unpaid" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      تسویه نشده
                    </button>
                  </div>
                )}
                {activeTab === "list_purchase" && (
                  <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto">
                    <button onClick={() => setInvoiceTabFilter("all")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "all" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      همه فاکتورها
                    </button>
                    <button onClick={() => setInvoiceTabFilter("received")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "received" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      رسید شده
                    </button>
                    <button onClick={() => setInvoiceTabFilter("pending_receive")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "pending_receive" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      رسید نشده
                    </button>
                    <button onClick={() => setInvoiceTabFilter("paid")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "paid" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      تسویه شده
                    </button>
                    <button onClick={() => setInvoiceTabFilter("unpaid")} className={\`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 \${invoiceTabFilter === "unpaid" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}\`}>
                      تسویه نشده
                    </button>
                  </div>
                )}`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/invoices/InvoicesList.tsx', content.replace(target, replacement));
  console.log('Patched UI successfully');
} else {
  console.log('Target for UI not found');
}
