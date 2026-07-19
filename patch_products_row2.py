import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

target_part2 = """                                      <td className="py-4 px-6 font-sans font-bold text-gray-600">
                                        {p.purchasePrice
                                          ? formatNumber(p.purchasePrice)
                                          : "---"}
                                      </td>
                                      <td className="py-4 px-6 font-sans font-black text-indigo-600 text-base">
                                        {formatNumber(p.price)}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <label className="relative inline-flex items-center cursor-pointer" title={p.isActive !== false ? "غیرفعال کردن" : "فعال کردن"}>
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={p.isActive !== false}
                                              onChange={() => {
                                                if (props.handleToggleProductActive) {
                                                  props.handleToggleProductActive(p.id, p.isActive !== false);
                                                }
                                              }}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-emerald-500"></div>
                                          </label>
                                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.isActive !== false ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100"}`}>
                                            {p.isActive !== false ? "فعال" : "غیرفعال"}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-100">
                                          <button
                                            onClick={() => {
                                              setViewingProduct(p);
                                              setActiveTab("product_view");
                                            }}
                                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="مشاهده کارت کالا"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDuplicateProduct(p)
                                            }
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all inline-block"
                                            title="کپی کردن کالا"
                                          >
                                            <Copy className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => setPriceChangeProduct(p)}
                                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all inline-block"
                                            title="تغییر قیمت سریع"
                                          >
                                            <Tag className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleEditProduct(p)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all inline-block"
                                            title="ویرایش کالا"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              setHistoryProductId(
                                                p.id.toString(),
                                              )
                                            }
                                            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all inline-block"
                                            title="سابقه قیمت‌ها"
                                          >
                                            <Activity className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              setPrintingBarcodeProduct(p)
                                            }
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all inline-block"
                                            title="چاپ بارکد"
                                          >
                                            <Printer className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              confirmAction(  "آیا از حذف این کالا اطمینان دارید؟",  () => handleDeleteProduct(p.id),  <div className="flex flex-col gap-2">    <div><strong>کد:</strong> {p.code}</div>    <div><strong>نام:</strong> {p.name}</div>    {p.category && <div><strong>گروه:</strong> {p.category}</div>}  </div>)
                                            }
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all inline-block"
                                            title="حذف کالا"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>"""

replacement_part2 = """                                      <td className="py-4 px-6 font-sans font-black text-indigo-600 text-base">
                                        {formatNumber(p.price)}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <div className="relative inline-block text-left group">
                                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-center w-8 h-8">
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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
                                                  confirmAction(  "آیا از حذف این کالا اطمینان دارید؟",  () => handleDeleteProduct(p.id),  <div className="flex flex-col gap-2">    <div><strong>کد:</strong> {p.code}</div>    <div><strong>نام:</strong> {p.name}</div>    {p.category && <div><strong>گروه:</strong> {p.category}</div>}  </div>)
                                                }
                                                className="text-gray-700 group/item flex w-full items-center px-4 py-2 text-sm hover:bg-rose-50 hover:text-rose-600 transition-colors text-right"
                                              >
                                                <Trash2 className="ml-3 h-4 w-4 text-gray-400 group-hover/item:text-rose-600" aria-hidden="true" />
                                                حذف کالا
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </td>"""

if target_part2 in content:
    content = content.replace(target_part2, replacement_part2)
    print("Row 2 successfully patched.")
else:
    print("Row 2 target not found.")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
