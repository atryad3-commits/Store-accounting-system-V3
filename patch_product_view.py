import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                ) : activeTab === "product_view" ? (
                  viewingProduct ? (
                    <ProductCardModal
                      product={viewingProduct}
                      warehouses={warehouses}
                      currency={storeSettings?.currency || "تومان"}
                      isModal={false}
                      persons={persons}
                      storeSettings={storeSettings}
                      onClose={() => {
                        setViewingProduct(null);
                      }}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto mt-10"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package className="w-8 h-8 text-indigo-600" />
                        جستجوی پیشرفته کارت کالا
                      </h2>
                      <div className="relative">
                        <SearchableSelect
                          options={(products || []).map((p) => ({
                            value: p.id,
                            label: p.name,
                            subLabel: formatProductStockDetails(p),
                            badge: p.type === "service" ? "خدمات" : "کالا",
                            searchStr: `${p.code || ""} ${p.barcode || ""}`,
                          }))}
                          value=""
                          onChange={(val) => {
                            const p = products.find(
                              (prod) => prod.id.toString() === val,
                            );
                            if (p) setViewingProduct(p);
                          }}
                          placeholder="جستجو کالا (نام، کد، بارکد)..."
                          searchPlaceholder="نام، کد یا بارکد کالا را وارد کنید..."
                        />
                      </div>
                      <div className="mt-8 text-center text-gray-500 text-sm">
                        جهت مشاهده تاریخچه و گردش کالا، جستجو و انتخاب کنید
                      </div>
                    </motion.div>
                  )
                ) : activeTab === "checklist" ? ("""

replacement = """                ) : activeTab === "product_view" ? (
                  <div className="flex flex-col h-full gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl shadow-sm border border-gray-100 shrink-0 ${viewingProduct ? 'p-4 mx-4 mt-4' : 'p-8 max-w-3xl mx-auto mt-10 w-full'}`}
                    >
                      <h2 className={`${viewingProduct ? 'text-lg mb-4' : 'text-2xl mb-6'} font-bold text-gray-800 flex items-center gap-2`}>
                        <Package className={`${viewingProduct ? 'w-5 h-5' : 'w-8 h-8'} text-indigo-600`} />
                        جستجوی پیشرفته کارت کالا
                      </h2>
                      <div className="relative">
                        <SearchableSelect
                          options={(products || []).map((p) => ({
                            value: p.id,
                            label: p.name,
                            subLabel: formatProductStockDetails(p),
                            badge: p.type === "service" ? "خدمات" : "کالا",
                            searchStr: `${p.code || ""} ${p.barcode || ""}`,
                          }))}
                          value={viewingProduct ? viewingProduct.id.toString() : ""}
                          onChange={(val) => {
                            const p = products.find(
                              (prod) => prod.id.toString() === val,
                            );
                            if (p) setViewingProduct(p);
                            else setViewingProduct(null);
                          }}
                          placeholder="جستجو کالا (نام، کد، بارکد)..."
                          searchPlaceholder="نام، کد یا بارکد کالا را وارد کنید..."
                        />
                      </div>
                      {!viewingProduct && (
                        <div className="mt-8 text-center text-gray-500 text-sm">
                          جهت مشاهده تاریخچه و گردش کالا، جستجو و انتخاب کنید
                        </div>
                      )}
                    </motion.div>
                    
                    {viewingProduct && (
                      <div className="flex-1 min-h-[500px]">
                        <ProductCardModal
                          product={viewingProduct}
                          warehouses={warehouses}
                          currency={storeSettings?.currency || "تومان"}
                          isModal={false}
                          persons={persons}
                          storeSettings={storeSettings}
                          onClose={() => {
                            setViewingProduct(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : activeTab === "checklist" ? ("""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced product_view tab in App.tsx")
else:
    print("Target not found in App.tsx")

with open('src/App.tsx', 'w') as f:
    f.write(content)

