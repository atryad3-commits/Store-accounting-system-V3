const fs = require('fs');
let code = fs.readFileSync('src/components/invoices/SaleInvoiceCreate.tsx', 'utf8');

code = code.replace(
`<input
                              type="number"
                              min="0"
                              step="any"
                              value={item.quantity}
                              onChange={(e: any) =>
                                handleItemChange(
                                  item.id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 font-sans text-center font-black text-slate-800 outline-none"
                              dir="ltr"
                            />`,
`<CurrencyInput
                              hideWords={true}
                              storeSettings={storeSettings}
                              value={item.quantity}
                              onChange={(e: any) =>
                                handleItemChange(
                                  item.id,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 font-sans text-center font-black text-slate-800 outline-none"
                            />`
);

code = code.replace(
`                          <CurrencyInput
                            currencyLabel={storeSettings?.currency}
                            value={item.unitPrice}
                            onChange={(e: any) =>
                              handleItemChange(
                                item.id,
                                "unitPrice",
                                e.target.value,
                              )
                            }
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-sans text-left font-bold outline-none"
                          />`,
`                          <CurrencyInput
                            storeSettings={storeSettings}
                            currencyLabel={storeSettings?.currency}
                            value={item.unitPrice}
                            onChange={(e: any) =>
                              handleItemChange(
                                item.id,
                                "unitPrice",
                                e.target.value,
                              )
                            }
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-sans text-left font-bold outline-none"
                          />`
);

fs.writeFileSync('src/components/invoices/SaleInvoiceCreate.tsx', code);
console.log('patched SaleInvoiceCreate');
