const fs = require('fs');

const files = [
  'src/components/invoices/PurchaseInvoiceCreate.tsx',
  'src/components/invoices/PurchaseReturnInvoiceCreate.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

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
                              className="w-full p-2.5 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans text-center font-black text-slate-800 outline-none"
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
                              className="w-full p-2.5 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans text-center font-black text-slate-800 outline-none"
                            />`
  );

  code = code.replace(
`                          <input
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
                            className="w-full p-2.5 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans text-center font-black text-slate-800 outline-none"
                            dir="ltr"
                          />`,
`                          <CurrencyInput
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
                            className="w-full p-2.5 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans text-center font-black text-slate-800 outline-none"
                          />`
  );
  
  // also check return invoices which might use pink/rose
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
                              className="w-full p-2.5 bg-rose-50/30 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 font-sans text-center font-black text-slate-800 outline-none"
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
                              className="w-full p-2.5 bg-rose-50/30 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 font-sans text-center font-black text-slate-800 outline-none"
                            />`
  );

  fs.writeFileSync(file, code);
  console.log('patched ' + file);
}
