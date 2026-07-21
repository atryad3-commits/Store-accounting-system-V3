with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    c = f.read()

old_labels = """            {pricingPrintMode === "labels" && (
              <div className="flex flex-wrap gap-4 items-start justify-start">
                {pricingWizardItems.map((item, idx) => {
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
                    >"""

new_labels = """            {pricingPrintMode === "labels" && (
              <div className="print-labels-container w-full" dir="rtl">
                {pricingWizardItems.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={idx}
                      className="label-item border border-black p-2 bg-white flex flex-col justify-center items-center overflow-hidden rounded-lg box-border"
                      style={printFormatId.includes('label_') ? {} : { borderRadius: '1rem', border: '2px solid black' }}
                    >
                      <div 
                        className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                        style={{ fontSize: `12px` }}
                      >
                        {storeSettings?.storeName || 'فروشگاه'}
                      </div>"""

c = c.replace(old_labels, new_labels)

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(c)
