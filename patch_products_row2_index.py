import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '{p.purchasePrice' in line and start_idx == -1:
        # Go back one line to get the <td className="...">
        if '<td' in lines[i-1]:
            start_idx = i - 1
        else:
            start_idx = i
    if '<Trash2 className="w-4 h-4" />' in line and start_idx != -1:
        # Find the closing </td> after this
        for j in range(i, i+15):
            if '</td>' in lines[j]:
                end_idx = j
                break
        break

if start_idx != -1 and end_idx != -1:
    replacement = """                                      <td className="py-4 px-6 font-sans font-black text-indigo-600 text-base">
                                        {formatNumber(p.price)}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <div className="relative inline-block text-left group">
                                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-center w-8 h-8">
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div className="absolute left-4 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                            <div className="py-1">
                                              <button
                                                onClick={() => {
                                                  setViewingProduct(p);
                                                  setActiveTab("product_view");
                                                }}
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-right"
                                              >
                                                <Eye className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-indigo-600" aria-hidden="true" />
                                                مشاهده کارت کالا
                                              </button>
                                              <button
                                                onClick={() => handleEditProduct(p)}
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-right"
                                              >
                                                <Edit2 className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-indigo-600" aria-hidden="true" />
                                                ویرایش کالا
                                              </button>
                                              <button
                                                onClick={() => setPriceChangeProduct(p)}
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-amber-50 hover:text-amber-600 transition-colors text-right"
                                              >
                                                <Tag className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-amber-600" aria-hidden="true" />
                                                تغییر قیمت سریع
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setHistoryProductId(
                                                    p.id.toString(),
                                                  )
                                                }
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-right"
                                              >
                                                <Activity className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-emerald-600" aria-hidden="true" />
                                                سابقه قیمت‌ها
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setPrintingBarcodeProduct(p)
                                                }
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-right"
                                              >
                                                <Printer className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-indigo-600" aria-hidden="true" />
                                                چاپ بارکد
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDuplicateProduct(p)
                                                }
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-right"
                                              >
                                                <Copy className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-indigo-600" aria-hidden="true" />
                                                کپی کردن کالا
                                              </button>
                                              <button
                                                onClick={() =>
                                                  confirmAction(
                                                    "آیا از حذف این کالا اطمینان دارید؟",
                                                    () => handleDeleteProduct(p.id),
                                                    <div className="flex flex-col gap-2">
                                                      <div><strong>کد:</strong> {p.code}</div>
                                                      <div><strong>نام:</strong> {p.name}</div>
                                                      {p.category && <div><strong>گروه:</strong> {p.category}</div>}
                                                    </div>
                                                  )
                                                }
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-rose-50 hover:text-rose-600 transition-colors text-right"
                                              >
                                                <Trash2 className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-rose-600" aria-hidden="true" />
                                                حذف کالا
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </td>\n"""

    new_lines = lines[:start_idx] + [replacement] + lines[end_idx+1:]
    with open('src/components/products/ProductsTab.tsx', 'w') as f:
        f.writelines(new_lines)
    print(f"Replaced lines {start_idx} to {end_idx}")
else:
    print("Could not find start or end index")
