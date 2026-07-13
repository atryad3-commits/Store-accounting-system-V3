const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// handleItemChange
content = content.replace(
`              let pPrice =
                isPurchase && product.purchasePrice
                  ? product.purchasePrice
                  : product.price;
              if (!pPrice || pPrice === 0) {
                pPrice = getLastPriceForProduct(product.id, isPurchase);
              }`,
`              let pPrice = getLastPriceForProduct(product.id, isPurchase);
              if (!pPrice || pPrice === 0) {
                pPrice = isPurchase && product.purchasePrice
                  ? product.purchasePrice
                  : product.price;
              }`
);

// handleFastAddProduct
content = content.replace(
`    let pPrice =
      isPurchase && product.purchasePrice
        ? product.purchasePrice
        : product.price;
    if (!pPrice || pPrice === 0) {
      pPrice = getLastPriceForProduct(product.id, isPurchase);
    }`,
`    let pPrice = getLastPriceForProduct(product.id, isPurchase);
    if (!pPrice || pPrice === 0) {
      pPrice = isPurchase && product.purchasePrice
        ? product.purchasePrice
        : product.price;
    }`
);

fs.writeFileSync('src/App.tsx', content);
