import re

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

# Replace the layout
old_layout_start = content.find('pricingPrintMode === "labels" && (')
if old_layout_start != -1:
    old_layout_end = content.find('</div>\n          </div>', old_layout_start)
    
    if old_layout_end != -1:
        new_layout = """pricingPrintMode === "labels" && (
              <>
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    .print-section, .print-section * {
                      visibility: visible;
                    }
                    .print-section {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                    }
                    ${selectedFormat.css}
                  }
                `}</style>
                <div className="print-labels-container w-full" dir="rtl">
                  {pricingWizardItems.map((item, idx) => {
                    const prod = products.find((p) => p.id === item.productId);
                    return (
                      <div
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
                      </div>
                    );
                  })}
                </div>
              </>
            )"""
        content = content[:old_layout_start] + new_layout + content[old_layout_end:]

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(content)
