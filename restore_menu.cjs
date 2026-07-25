const fs = require('fs');
const file = 'src/components/products/ProductsTab.tsx';
let content = fs.readFileSync(file, 'utf8');

const menuContent = `
                          <button
                            onClick={() => setIsProductActionsMenuOpen(!isProductActionsMenuOpen)}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-2 transition-colors text-sm font-bold border border-slate-200 shadow-sm"
                          >
                            <MoreVertical className="w-4 h-4" />
                            عملیات بیشتر
                            <ChevronDown className={\`w-3 h-3 transition-transform \${isProductActionsMenuOpen ? "rotate-180" : ""}\`} />
                          </button>
                          <AnimatePresence>
                            {isProductActionsMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                              >
                                <button
                                  onClick={() => {
                                    handleExportProductsData();
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium"
                                >
                                  <Download className="w-4 h-4" />
                                  صدور اکسل
                                </button>
                                <button
                                  onClick={() => {
                                    handleImportProductsData();
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium"
                                >
                                  <Upload className="w-4 h-4" />
                                  ورود اطلاعات از اکسل
                                </button>
                                <button
                                  onClick={() => {
                                    handleDownloadProductsTemplate();
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium"
                                >
                                  <FileSpreadsheet className="w-4 h-4" />
                                  دانلود قالب استاندارد
                                </button>
                                <button
                                  onClick={() => {
                                    setIsAIProductSearchOpen(true);
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium border-t border-slate-100 mt-1 pt-2"
                                >
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  استخراج هوشمند کالاها
                                </button>
                                <button
                                  onClick={() => {
                                    setIsGenerateBarcodesModalOpen(true);
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium"
                                >
                                  <Barcode className="w-4 h-4" />
                                  تولید گروهی بارکد
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab('inventory');
                                    setIsProductActionsMenuOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium border-t border-slate-100 mt-1 pt-2"
                                >
                                  <Activity className="w-4 h-4 text-emerald-500" />
                                  بروزرسانی سریع موجودی
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
`;

content = content.replace(
  /<div\s*className="relative"\s*tabIndex=\{0\}\s*onBlur=\{\(e\) => \{\s*if \(\s*!e\.currentTarget\.contains\(e\.relatedTarget as Node\)\s*\) \{\s*setIsProductActionsMenuOpen\(false\);\s*\}\s*\}\}\s*>/,
  '<div className="relative" tabIndex={0} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { setIsProductActionsMenuOpen(false); } }}>\n' + menuContent
);

// Also fix the filteredProducts bug in my new code!
content = content.replace(
  'setPrintingBarcodeProduct(filteredProducts.filter(p => selectedProductIds.includes(p.id)))',
  'setPrintingBarcodeProduct(products.filter(p => selectedProductIds.includes(p.id)))'
);

fs.writeFileSync(file, content);
