with open('src/components/modals/PrintBarcodeModal.tsx', 'r') as f:
    c = f.read()

# Update PRINT_FORMATS
old_a4 = "css: `@page { size: A4; margin: 10mm; } .print-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; } .label-item { height: 35mm; }`"
new_a4 = "css: `@page { size: A4; margin: 10mm; } .print-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; } .label-item { height: 52mm; page-break-inside: avoid; }`"
c = c.replace(old_a4, new_a4)

old_a5 = "css: `@page { size: A5; margin: 5mm; } .print-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2mm; } .label-item { height: 32mm; }`"
new_a5 = "css: `@page { size: A5; margin: 5mm; } .print-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3mm; } .label-item { height: 37mm; page-break-inside: avoid; }`"
c = c.replace(old_a5, new_a5)

c = c.replace('const [titleFontSize, setTitleFontSize] = useState(11);', 'const [titleFontSize, setTitleFontSize] = useState(13);')
c = c.replace('const [priceFontSize, setPriceFontSize] = useState(12);', 'const [priceFontSize, setPriceFontSize] = useState(15);')


old_labels = """        <div className="hidden print:flex print-container print:w-full" dir="rtl">
          {Array.from({ length: labelCount }).map((_, index) => (
            <div key={index} className="label-item border border-black p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border">
              {showTitle && ("""

new_labels = """        <div className="hidden print:flex print-container print:w-full" dir="rtl">
          {Array.from({ length: labelCount }).map((_, index) => (
            <div key={index} className="label-item border border-black p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border">
              <div 
                className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                style={{ fontSize: `12px` }}
              >
                {storeSettings?.storeName || 'فروشگاه'}
              </div>
              {showTitle && ("""

c = c.replace(old_labels, new_labels)

with open('src/components/modals/PrintBarcodeModal.tsx', 'w') as f:
    f.write(c)
