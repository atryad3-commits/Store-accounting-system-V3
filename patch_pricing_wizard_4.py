import re

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

# Let's add state for font sizes in PricingWizardModal
state_pattern = r"const \[printFormatId, setPrintFormatId\] = useState\('a4'\);"
state_replacement = r"""const [printFormatId, setPrintFormatId] = useState('a4');
  const [labelTitleFontSize, setLabelTitleFontSize] = useState(11);
  const [labelPriceFontSize, setLabelPriceFontSize] = useState(12);
  const [labelShowTitle, setLabelShowTitle] = useState(true);
  const [labelShowPrice, setLabelShowPrice] = useState(true);
  const [labelBarcodeScale, setLabelBarcodeScale] = useState(90);"""
content = re.sub(state_pattern, state_replacement, content)

# Now inject the settings UI in the buttons area when labels mode is active.
# Where is the buttons area?
btn_pattern = r'(<div className="flex flex-col sm:flex-row items-center gap-3">.*?</div>)'
btn_replacement = r"""<div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("list");
                    // ... rest of list button click
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all shadow-indigo-600/20 hover:-translate-y-0.5"
                >
                  <List className="w-5 h-5" />
                  ثبت قیمت و چاپ لیست
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("labels");
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <Printer className="w-5 h-5" />
                  ثبت قیمت و چاپ لیبل چسبی
                </button>
              </div>

              {pricingPrintMode === "labels" && (
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-600">فرمت لیبل:</span>
                    <select
                      value={printFormatId}
                      onChange={(e) => setPrintFormatId(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-none"
                    >
                      {PRINT_FORMATS.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={labelShowTitle} onChange={(e) => setLabelShowTitle(e.target.checked)} className="w-3.5 h-3.5 rounded" />
                      <span className="text-xs font-bold text-slate-600">نام</span>
                    </label>
                    {labelShowTitle && (
                      <input type="range" min="8" max="18" value={labelTitleFontSize} onChange={(e) => setLabelTitleFontSize(Number(e.target.value))} className="w-16" title="سایز نام" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={labelShowPrice} onChange={(e) => setLabelShowPrice(e.target.checked)} className="w-3.5 h-3.5 rounded" />
                      <span className="text-xs font-bold text-slate-600">قیمت</span>
                    </label>
                    {labelShowPrice && (
                      <input type="range" min="8" max="24" value={labelPriceFontSize} onChange={(e) => setLabelPriceFontSize(Number(e.target.value))} className="w-16" title="سایز قیمت" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                    <span className="text-xs font-bold text-slate-600">اندازه بارکد:</span>
                    <input type="range" min="50" max="150" value={labelBarcodeScale} onChange={(e) => setLabelBarcodeScale(Number(e.target.value))} className="w-16" />
                  </div>
                </div>
              )}
            </div>"""

# Replace the buttons block. Wait, the original code had:
original_btn_block = """              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">فرمت لیبل:</span>
                  <select
                    value={printFormatId}
                    onChange={(e) => setPrintFormatId(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {PRINT_FORMATS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("list");
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all shadow-indigo-600/20 hover:-translate-y-0.5"
                >
                  <List className="w-5 h-5" />
                  ثبت قیمت و چاپ لیست
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("labels");
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <Printer className="w-5 h-5" />
                  ثبت قیمت و چاپ لیبل چسبی
                </button>
              </div>"""

content = content.replace(original_btn_block, btn_replacement)

# Now update the layout
layout_pattern = r'(pricingPrintMode === "labels" && \(\s*<>\s*<style>.*?</style>\s*<div className="print-labels-container w-full" dir="rtl">.*?)(</div>\s*</>\s*\))'
# Wait, let's just do a string replacement for the label-item structure.
old_label_item = """                      <div
                        key={idx}
                        className="label-item border border-slate-900 p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border"
                      >
                        <div className="font-bold text-black text-[11px] mb-1 truncate px-1 w-full text-center leading-tight">
                          {prod?.name || "بدون نام"}
                        </div>
                        <div className="flex justify-center text-center items-center overflow-hidden scale-90 origin-top">
                          {prod?.barcode ? (
                            <Barcode
                              value={prod.barcode}
                              format="CODE128"
                              width={1.5}
                              height={35}
                              fontSize={11}
                              textMargin={1}
                              margin={0}
                              background="#ffffff"
                              lineColor="#000000"
                              displayValue={true}
                            />
                          ) : (
                            <div className="text-[10px]">بدون بارکد</div>
                          )}
                        </div>
                        <div className="text-[12px] font-black text-black w-full text-center mt-1">
                          {formatNumber(item.salePrice)} {storeSettings?.currency || "تومان"}
                        </div>
                      </div>"""
new_label_item = """                      <div
                        key={idx}
                        className="label-item border border-slate-900 p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border"
                      >
                        {labelShowTitle && (
                          <div 
                            className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                            style={{ fontSize: `${labelTitleFontSize}px` }}
                          >
                            {prod?.name || "بدون نام"}
                          </div>
                        )}
                        <div 
                          className="flex justify-center text-center items-center overflow-hidden origin-top"
                          style={{ transform: `scale(${labelBarcodeScale / 100})`, marginTop: labelShowTitle ? '0' : '4px', marginBottom: labelShowPrice ? '0' : '4px' }}
                        >
                          {prod?.barcode ? (
                            <Barcode
                              value={prod.barcode}
                              format="CODE128"
                              width={1.5}
                              height={35}
                              fontSize={11}
                              textMargin={1}
                              margin={0}
                              background="#ffffff"
                              lineColor="#000000"
                              displayValue={true}
                            />
                          ) : (
                            <div className="text-[10px]">بدون بارکد</div>
                          )}
                        </div>
                        {labelShowPrice && (
                          <div 
                            className="font-black text-black w-full text-center mt-1"
                            style={{ fontSize: `${labelPriceFontSize}px` }}
                          >
                            {formatNumber(item.salePrice)} {storeSettings?.currency || "تومان"}
                          </div>
                        )}
                      </div>"""
content = content.replace(old_label_item, new_label_item)

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(content)
