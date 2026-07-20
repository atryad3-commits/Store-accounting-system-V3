import re

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

# The current label layout is:
pattern = r'(<div\s+key=\{idx\}\s+className="border-\[5px\] border-slate-900 p-3 rounded-3xl flex flex-col justify-between text-center w-\[95mm\] h-\[65mm\] break-inside-avoid relative overflow-hidden bg-white shadow-sm"\s*>.*?)(</div>\s*);\s*\}\)\}\s*</div>\s*\)\}\s*</div>)'

# Let's just find the loop
loop_pattern = r'(\{pricingWizardItems\.map\(\(item, idx\) => \{\s*const prod = products\.find\(\(p\) => p\.id === item\.productId\);\s*return \(\s*<div\s+key=\{idx\}.*?</div>\s*\);\s*\}\)\})'

match = re.search(loop_pattern, content, flags=re.DOTALL)
if match:
    replacement = r"""{pricingWizardItems.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={idx}
                      className="border border-slate-900 p-2 bg-white flex flex-col justify-center items-center overflow-hidden rounded-lg box-border"
                      style={{ 
                        width: printFormatId.includes('50x30') ? '48mm' : (printFormatId.includes('80x40') ? '78mm' : '95mm'),
                        height: printFormatId.includes('50x30') ? '28mm' : (printFormatId.includes('80x40') ? '38mm' : '65mm'),
                        margin: printFormatId.includes('label_') ? '1mm auto' : '0',
                        pageBreakAfter: printFormatId.includes('label_') ? 'always' : 'auto',
                        border: printFormatId.includes('label_') ? 'none' : '5px solid #0f172a',
                        borderRadius: printFormatId.includes('label_') ? '0' : '1.5rem',
                      }}
                    >
                      {labelShowTitle && (
                        <div 
                          className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                          style={{ fontSize: `${labelTitleFontSize}px` }}
                        >
                          {item.productName}
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
                          {item.salePrice ? toPersianDigits(formatNumber(item.salePrice)) : "---"} {storeSettings?.currency || "تومان"}
                        </div>
                      )}
                    </div>
                  );
                })}"""
    content = content[:match.start()] + replacement + content[match.end():]
    with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find loop to patch")
