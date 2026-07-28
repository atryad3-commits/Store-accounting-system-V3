const fs = require('fs');
let content = fs.readFileSync('src/components/modals/ExtraModals.tsx', 'utf8');

content = content.replace(
  `          setBarcodeLength={setBarcodeLength}
          handleGenerateBarcodes={async () => {`,
  `          setBarcodeLength={setBarcodeLength}
          products={props.products}
          handleGenerateBarcodes={async () => {`
);

fs.writeFileSync('src/components/modals/ExtraModals.tsx', content);
