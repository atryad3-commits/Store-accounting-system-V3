const fs = require('fs');
const file = 'src/components/modals/PrintBarcodeModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change interface
content = content.replace(
  'product: any;',
  'product?: any;\n  products?: any[];'
);

// Add logic to get targetProducts
content = content.replace(
  'export default function PrintBarcodeModal({ product, onClose, storeSettings }: PrintBarcodeModalProps) {',
  `export default function PrintBarcodeModal({ product, products, onClose, storeSettings }: PrintBarcodeModalProps) {
  const targetProducts = products && products.length > 0 ? products : product ? [product] : [];
  `
);

// We should iterate over targetProducts inside the print-container.
const printLoop = `
          {targetProducts.map((prod, pIdx) => {
            const bVal = prod.barcode || prod.code;
            return Array.from({ length: labelCount }).map((_, index) => (
            <div key={\`\${pIdx}-\${index}\`} className="label-item border border-black p-2 bg-white flex flex-col justify-center items-center w-full overflow-hidden rounded-lg box-border">
              <div 
                className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                style={{ fontSize: \`12px\` }}
              >
                {storeSettings?.storeName || 'فروشگاه'}
              </div>
              {showTitle && (
                <div 
                  className="font-bold text-black mb-1 truncate px-1 w-full text-center leading-tight"
                  style={{ fontSize: \`\${titleFontSize}px\` }}
                >
                  {prod.name}
                </div>
              )}
              <div 
                className="flex justify-center text-center items-center overflow-hidden origin-top"
                style={{ transform: \`scale(\${barcodeScale / 100})\`, marginTop: showTitle ? '0' : '4px', marginBottom: showPrice ? '0' : '4px' }}
              >
                {bVal ? (
                  <Barcode
                    value={bVal}
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
                  style={{ fontSize: \`\${priceFontSize}px\` }}
                >
                  {formatNumber(prod.price)} {storeSettings?.currency || "تومان"}
                </div>
              )}
            </div>
          ))
          })}
`;

content = content.replace(
  /\{Array\.from\(\{ length: labelCount \}\)\.map\(\(\_, index\) => \([\s\S]*?\)\)\}/,
  printLoop
);

// For the preview (max-w-xs), just show the first product.
content = content.replace(
  'const barcodeValue = product.barcode || product.code;',
  'const previewProduct = targetProducts[0] || {};\n  const barcodeValue = previewProduct.barcode || previewProduct.code;'
);
content = content.replace(
  /product\.name/g,
  'previewProduct.name'
);
content = content.replace(
  /product\.price/g,
  'previewProduct.price'
);

fs.writeFileSync(file, content);
