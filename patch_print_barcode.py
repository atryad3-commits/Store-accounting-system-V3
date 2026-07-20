import re

with open('src/components/modals/PrintBarcodeModal.tsx', 'r') as f:
    content = f.read()

state_pattern = r"const \[labelCount, setLabelCount\] = useState\(selectedFormat\.defaultCount\);"
state_replacement = r"""const [labelCount, setLabelCount] = useState(selectedFormat.defaultCount);
  const [titleFontSize, setTitleFontSize] = useState(11);
  const [priceFontSize, setPriceFontSize] = useState(12);
  const [showTitle, setShowTitle] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [barcodeScale, setBarcodeScale] = useState(100);
"""
content = re.sub(state_pattern, state_replacement, content)

settings_pattern = r'(<div className="flex flex-col gap-4">.*?</div>\s+</div>)'
settings_replacement = r"""<div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-bold text-slate-600">فرمت چاپ:</span>
                  <select
                    value={formatId}
                    onChange={(e) => handleFormatChange(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {PRINT_FORMATS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-bold text-slate-600">تعداد لیبل:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLabelCount(Math.max(1, labelCount - 1))}
                      className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-bold text-lg w-8 text-center">{labelCount}</span>
                    <button
                      onClick={() => setLabelCount(labelCount + 1)}
                      className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-100">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-bold text-slate-600">نمایش نام کالا</span>
                    <input type="checkbox" checked={showTitle} onChange={(e) => setShowTitle(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  </label>
                  {showTitle && (
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-xs text-slate-500">سایز فونت نام:</span>
                      <input type="range" min="8" max="18" value={titleFontSize} onChange={(e) => setTitleFontSize(Number(e.target.value))} className="w-24" />
                      <span className="text-xs font-mono w-4 text-left">{titleFontSize}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-bold text-slate-600">نمایش قیمت</span>
                    <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  </label>
                  {showPrice && (
                    <div className="flex items-center justify-between pl-4">
                      <span className="text-xs text-slate-500">سایز فونت قیمت:</span>
                      <input type="range" min="8" max="24" value={priceFontSize} onChange={(e) => setPriceFontSize(Number(e.target.value))} className="w-24" />
                      <span className="text-xs font-mono w-4 text-left">{priceFontSize}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between sm:col-span-2 pl-4">
                  <span className="text-xs font-bold text-slate-600">اندازه بارکد (%):</span>
                  <input type="range" min="50" max="150" value={barcodeScale} onChange={(e) => setBarcodeScale(Number(e.target.value))} className="flex-1 mx-4" />
                  <span className="text-xs font-mono w-8 text-left">{barcodeScale}%</span>
                </div>
              </div>
            </div>
          </div>"""
content = re.sub(settings_pattern, settings_replacement, content, flags=re.DOTALL)

print_layout_pattern = r'(<div className="hidden print:flex print-container print:w-full" dir="rtl">.*?)(\s*<div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 print:hidden">)'
print_layout_replacement = r"""<div className="hidden print:flex print-container print:w-full" dir="rtl">
          {Array.from({ length: labelCount }).map((_, index) => (
            <div key={index} className="label-item border border-black p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border">
              {showTitle && (
                <div 
                  className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                  style={{ fontSize: `${titleFontSize}px` }}
                >
                  {product.name}
                </div>
              )}
              <div 
                className="flex justify-center text-center items-center overflow-hidden origin-top"
                style={{ transform: `scale(${barcodeScale / 100})`, marginTop: showTitle ? '0' : '4px', marginBottom: showPrice ? '0' : '4px' }}
              >
                {barcodeValue ? (
                  <Barcode
                    value={barcodeValue}
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
              {showPrice && (
                <div 
                  className="font-black text-black w-full text-center mt-1"
                  style={{ fontSize: `${priceFontSize}px` }}
                >
                  {formatNumber(product.price)} {storeSettings?.currency || "تومان"}
                </div>
              )}
            </div>
          ))}
        </div>\2"""
content = re.sub(print_layout_pattern, print_layout_replacement, content, flags=re.DOTALL)

with open('src/components/modals/PrintBarcodeModal.tsx', 'w') as f:
    f.write(content)
