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
