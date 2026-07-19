              {isProductModalOpen && (
                <div key="isProductModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white md:rounded-2xl shadow-xl md:border border-gray-100 overflow-hidden w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" />
                        ثبت کالا / خدمات جدید
                      </h3>
                      <button
                        onClick={() => setIsProductModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-0 overflow-y-auto flex-1">
                      <div className="flex border-b border-gray-200 px-6 pt-4 gap-6 sticky top-0 bg-white z-10">
                        <button
                          type="button"
                          onClick={() => setProductFormTab("general")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "general" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          اطلاعات عمومی
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormTab("financial")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "financial" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          اطلاعات مالی
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductFormTab("inventory")}
                          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "inventory" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                          انبار و تکمیلی
                        </button>
                        {editingProductId && (
                          <button
                            type="button"
                            onClick={() => setProductFormTab("history")}
                            className={`pb-3 font-bold text-sm border-b-2 transition-colors ${productFormTab === "history" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                          >
                            تاریخچه قیمت‌ها
                          </button>
                        )}
                      </div>

                      <form
                        id="productForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ثبت اطلاعات کالا/خدمات اطمینان دارید؟",
                            () => handleSubmitProduct(e as any),
                          );
                        }}
                        className="p-6"
                      >
                        {/* General Info Tab */}
                        {productFormTab === "general" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="w-full md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  عنوان کالا / خدمات{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={newProductName}
                                  onChange={(e) =>
                                    setNewProductName(e.target.value)
                                  }
                                  placeholder="مثال: گوشی موبایل سامسونگ S23"
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-gray-50 focus:bg-white"
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  نوع <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={newProductType}
                                  onChange={(e) =>
                                    setNewProductType(
                                      e.target.value as "product" | "service",
                                    )
                                  }
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                >
                                  <option value="product">کالا (فیزیکی)</option>
                                  <option value="service">
                                    خدمات (غیرفیزیکی)
                                  </option>
                                </select>
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  گروه‌بندی
                                </label>
                                <select
                                  value={newProductCategoryId}
                                  onChange={(e) =>
                                    setNewProductCategoryId(e.target.value)
                                  }
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                >
                                  <option value="">بدون گروه (عمومی)</option>
                                  {productCategories.map((cat, index) => (
                                    <option key={cat.id ? `cat-${cat.id}-${index}` : `cat-${Math.random()}`} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* وضعیت کالا */}
                            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-gray-800">وضعیت فعال بودن کالا / خدمت</span>
                                <span className="text-xs text-gray-500">کالاهای غیرفعال در بخش‌های فاکتوردهی و انبارداری نمایش داده نمی‌شوند.</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={newProductIsActive}
                                    onChange={(e) => setNewProductIsActive(e.target.checked)}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <span className={`text-xs font-black ${newProductIsActive ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded" : "text-rose-600 bg-rose-50 px-2 py-1 rounded"}`}>
                                  {newProductIsActive ? "فعال" : "غیرفعال"}
                                </span>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                              <h4 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                تعریف واحد شمارش
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    واحد اصلی (کوچکترین جزء)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductUnit}
                                    onChange={(e) =>
                                      setNewProductUnit(e.target.value)
                                    }
                                    placeholder="مثال: عدد، کیلوگرم"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    واحد فرعی (بسته‌بندی بزرگتر)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductSecondaryUnit}
                                    onChange={(e) =>
                                      setNewProductSecondaryUnit(e.target.value)
                                    }
                                    placeholder="مثال: کارتن، بسته"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                  />
                                  <p className="text-[10px] text-blue-600 mt-1 opacity-80">
                                    (اختیاری)
                                  </p>
                                </div>
                                <div className="w-full">
                                  <label className="block text-xs font-bold text-blue-800 mb-2">
                                    ضریب تبدیل (هر واحد فرعی چند واحد اصلی است؟)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={newProductUnitRatio}
                                    onChange={(e) =>
                                      setNewProductUnitRatio(e.target.value)
                                    }
                                    placeholder="مثال: 2.5 یا 24"
                                    className="w-full px-3 py-2.5 rounded-lg border border-blue-200 focus:ring-max focus:ring-blue-500 shadow-sm text-sm"
                                    disabled={!newProductSecondaryUnit}
                                  />
                                  {newProductSecondaryUnit &&
                                    newProductUnitRatio &&
                                    Number(newProductUnitRatio) > 0 &&
                                    newProductUnit && (
                                      <p className="text-xs font-bold text-emerald-600 mt-2">
                                        1 {newProductSecondaryUnit} ={" "}
                                        {newProductUnitRatio} {newProductUnit}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Financial Info Tab */}
                        {productFormTab === "financial" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="w-full md:col-span-2">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  تاریخ ثبت / تغییر قیمت
                                </label>
                                <input
                                  type="date"
                                  value={newProductPriceDate}
                                  onChange={(e) => setNewProductPriceDate(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left bg-white"
                                />
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  قیمت خرید بر اساس کوچکترین واحد (
                                  {newProductUnit || "واحد اصلی"}) (
                                  {storeSettings?.currency || "تومان"})
                                </label>
                                <CurrencyInput
                                  value={newProductPurchasePrice}
                                  onChange={(e: any) =>
                                    setNewProductPurchasePrice(e.target.value)
                                  }
                                  placeholder="مثال: 100000"
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left font-bold bg-white"
                                />
                                {newProductSecondaryUnit &&
                                  newProductUnitRatio &&
                                  Number(newProductUnitRatio) > 0 &&
                                  newProductPurchasePrice && (
                                    <p className="text-xs font-bold text-emerald-700 mt-1.5 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                      معادل{" "}
                                      <span className="font-mono text-sm font-black text-indigo-700">
                                        {formatNumber(
                                          Number(
                                            newProductPurchasePrice.replace(
                                              /,/g,
                                              "",
                                            ),
                                          ) * Number(newProductUnitRatio),
                                        )}
                                      </span>{" "}
                                      {storeSettings?.currency || "تومان"} به
                                      ازای هر{" "}
                                      <span className="underline">
                                        {newProductSecondaryUnit}
                                      </span>{" "}
                                      (ضریب {newProductUnitRatio})
                                    </p>
                                  )}
                              </div>
                              <div className="w-full">
                                <label className="block text-sm font-bold text-emerald-950 mb-2">
                                  قیمت فروش بر اساس کوچکترین واحد (
                                  {newProductUnit || "واحد اصلی"}) (
                                  {storeSettings?.currency || "تومان"})
                                </label>
                                <CurrencyInput
                                  value={newProductPrice}
                                  onChange={(e: any) =>
                                    setNewProductPrice(e.target.value)
                                  }
                                  placeholder="مثال: 150000"
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left font-bold bg-white"
                                />
                                {newProductSecondaryUnit &&
                                  newProductUnitRatio &&
                                  Number(newProductUnitRatio) > 0 &&
                                  newProductPrice && (
                                    <p className="text-xs font-bold text-indigo-700 mt-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                      معادل{" "}
                                      <span className="font-mono text-sm font-black text-indigo-800">
                                        {formatNumber(
                                          Number(
                                            newProductPrice.replace(/,/g, ""),
                                          ) * Number(newProductUnitRatio),
                                        )}
                                      </span>{" "}
                                      {storeSettings?.currency || "تومان"} به
                                      ازای هر{" "}
                                      <span className="underline">
                                        {newProductSecondaryUnit}
                                      </span>{" "}
                                      (ضریب {newProductUnitRatio})
                                    </p>
                                  )}
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                              <div>
                                <p className="text-sm font-bold text-gray-700">
                                  حاشیه سود حدودی:
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  تفاوت قیمت فروش و خرید
                                </p>
                              </div>
                              <div
                                className="font-mono text-lg font-black text-indigo-600"
                                dir="ltr"
                              >
                                {newProductPrice && newProductPurchasePrice ? (
                                  (() => {
                                    const diff =
                                      Number(newProductPrice) -
                                      Number(newProductPurchasePrice);
                                    const percent =
                                      Number(newProductPurchasePrice) > 0
                                        ? (
                                            (diff /
                                              Number(newProductPurchasePrice)) *
                                            100
                                          ).toFixed(1)
                                        : 100;
                                    return (
                                      <span
                                        className={
                                          diff > 0
                                            ? "text-emerald-600"
                                            : "text-rose-600"
                                        }
                                      >
                                        {formatNumber(diff)}{" "}
                                        {storeSettings.currency}{" "}
                                        <span className="text-sm">
                                          ({percent}%)
                                        </span>
                                      </span>
                                    );
                                  })()
                                ) : (
                                  <span className="text-gray-400">---</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inventory & Advanced Tab */}
                        {productFormTab === "inventory" && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {newProductType === "product" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    انبار مرجع
                                  </label>
                                  <select
                                    value={newProductWarehouseId}
                                    onChange={(e) =>
                                      setNewProductWarehouseId(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 bg-white"
                                  >
                                    <option value="">
                                      بدون انبار (موجودی کلی)
                                    </option>
                                    {warehouses
                                      .filter((w) => w.isActive)
                                      .map((wh, index) => (
                                        <option key={wh.id ? `wh-${wh.id}-${index}` : `wh-${Math.random()}`} value={wh.id}>
                                          {wh.name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    موجودی اولیه در انبار
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newProductStock}
                                    onChange={(e) =>
                                      setNewProductStock(e.target.value)
                                    }
                                    placeholder="تعداد در انبار"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    حداقل موجودی (هشدار شارژ)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newProductMinStock}
                                    onChange={(e) =>
                                      setNewProductMinStock(e.target.value)
                                    }
                                    placeholder="مثال: 5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    کد کالا (سیستمی)
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductCode}
                                    onChange={(e) =>
                                      setNewProductCode(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="w-full">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    بارکد
                                  </label>
                                  <input
                                    type="text"
                                    value={newProductBarcode}
                                    onChange={(e) =>
                                      setNewProductBarcode(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 font-mono text-left tracking-widest"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="w-full">
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                توضیحات تکمیلی
                              </label>
                              <textarea
                                value={newProductDesc}
                                onChange={(e) =>
                                  setNewProductDesc(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-gray-900 min-h-[100px] resize-y"
                                rows={3}
                                placeholder="توضیحات کالا که ممکن است در فاکتور چاپ شود..."
                              />
                            </div>
                          </div>
                        )}

                        {/* History Tab */}
                        {productFormTab === "history" && (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            {/* Purchase Price History */}
                            <div className="space-y-3">
                              <h3 className="text-lg font-extrabold text-gray-900">
                                تاریخچه تغییرات قیمت خرید
                              </h3>
                              <div className="bg-white border flex-1 border-gray-100 shadow-sm rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                  <thead className="bg-gray-50/50">
                                    <tr>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        تاریخ و زمان
                                      </th>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        قیمت خرید
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                      const purchaseHistory = currentProductPriceHistory.filter(h => h.type === 'purchase');
                                      if (purchaseHistory.length === 0) {
                                        return (
                                          <tr>
                                            <td
                                              colSpan={2}
                                              className="text-center py-6 text-sm text-gray-500"
                                            >
                                              تاریخچه‌ای برای این کالا ثبت نشده
                                              است.
                                            </td>
                                          </tr>
                                        );
                                      }
                                      return purchaseHistory
                                        .sort(
                                          (a, b) =>
                                            new Date(b.date).getTime() -
                                            new Date(a.date).getTime(),
                                        )
                                        .map((h, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                          >
                                            <td className="px-4 py-3 text-sm text-gray-700" dir="ltr">
                                              {editingHistoryId === h.id ? (
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="date"
                                                    value={editingHistoryDate.split('T')[0]}
                                                    onChange={(e) => setEditingHistoryDate(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />
                                                </div>
                                              ) : (
                                                new Date(h.date).toLocaleString("fa-IR")
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center">
                                              <span>{addCommas(h.price)}</span>
                                              {editingHistoryId === h.id ? (
                                                <div className="flex gap-2">
                                                  <button onClick={() => handleSaveHistoryDate(h)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                    <Check className="w-4 h-4" />
                                                  </button>
                                                  <button onClick={() => setEditingHistoryId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    setEditingHistoryId(h.id);
                                                    setEditingHistoryDate(h.date);
                                                  }}
                                                  className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                                                >
                                                  <Pencil className="w-4 h-4" />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ));
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Sale Price History */}
                            <div className="space-y-3">
                              <h3 className="text-lg font-extrabold text-gray-900">
                                تاریخچه تغییرات قیمت فروش
                              </h3>
                              <div className="bg-white border flex-1 border-gray-100 shadow-sm rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                  <thead className="bg-gray-50/50">
                                    <tr>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        تاریخ و زمان
                                      </th>
                                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">
                                        قیمت فروش
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                      const saleHistory = currentProductPriceHistory.filter(h => h.type === 'sale');
                                      if (saleHistory.length === 0) {
                                        return (
                                          <tr>
                                            <td
                                              colSpan={2}
                                              className="text-center py-6 text-sm text-gray-500"
                                            >
                                              تاریخچه‌ای برای این کالا ثبت نشده
                                              است.
                                            </td>
                                          </tr>
                                        );
                                      }
                                      return saleHistory
                                        .sort(
                                          (a, b) =>
                                            new Date(b.date).getTime() -
                                            new Date(a.date).getTime(),
                                        )
                                        .map((h, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-slate-50"
                                          >
                                            <td className="px-4 py-3 text-sm text-gray-700" dir="ltr">
                                              {editingHistoryId === h.id ? (
                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="date"
                                                    value={editingHistoryDate.split('T')[0]}
                                                    onChange={(e) => setEditingHistoryDate(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />
                                                </div>
                                              ) : (
                                                new Date(h.date).toLocaleString("fa-IR")
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center">
                                              <span>{addCommas(h.price)}</span>
                                              {editingHistoryId === h.id ? (
                                                <div className="flex gap-2">
                                                  <button onClick={() => handleSaveHistoryDate(h)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                    <Check className="w-4 h-4" />
                                                  </button>
                                                  <button onClick={() => setEditingHistoryId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => {
                                                    setEditingHistoryId(h.id);
                                                    setEditingHistoryDate(h.date);
                                                  }}
                                                  className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                                                >
                                                  <Pencil className="w-4 h-4" />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        ));
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hidden required fields for HTML5 validation validation to still work across tabs */}
                        <div className="hidden">
                          <input
                            type="text"
                            required
                            value={newProductName}
                            onChange={() => {}}
                          />
                        </div>
                      </form>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        form="productForm"
                        disabled={submittingProduct}
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submittingProduct ? (
