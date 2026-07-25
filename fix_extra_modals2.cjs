const fs = require('fs');
const file = 'src/components/modals/ExtraModals.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix storeSettings
content = content.replace(
  'accounts, cashboxes, checkbooks, storeSettings, confirmAction,',
  'accounts, cashboxes, checkbooks, confirmAction,'
);

// Fix PrintBarcodeModal
const printBarcodeBlockRegex = /\{\(isPrintBarcodeModalOpen && editingProductId\) \|\| props\.printingBarcodeProduct \? \([\s\S]*?<\/PrintBarcodeModal>[\s\S]*?\)\s*\}/;

const newPrintBarcodeBlock = `
      {((isPrintBarcodeModalOpen && editingProductId) || props.printingBarcodeProduct) ? (
        <PrintBarcodeModal
          product={editingProductId ? products.find((p: any) => p.id === editingProductId) : (Array.isArray(props.printingBarcodeProduct) ? undefined : props.printingBarcodeProduct)}
          products={Array.isArray(props.printingBarcodeProduct) ? props.printingBarcodeProduct : undefined}
          onClose={() => {
             setIsPrintBarcodeModalOpen(false);
             if (props.setPrintingBarcodeProduct) props.setPrintingBarcodeProduct(null);
          }}
          storeSettings={storeSettings}
        />
      ) : null}
`;

// Wait, the original code had <PrintBarcodeModal /> self closing! Let's just use string replacement on the exact block.
content = content.replace(
  /\{\(isPrintBarcodeModalOpen && editingProductId\) \|\| props\.printingBarcodeProduct \? \([\s\S]*?product=\{products\.find[\s\S]*?\/>\s*\)\s*\}/,
  newPrintBarcodeBlock
);

fs.writeFileSync(file, content);
