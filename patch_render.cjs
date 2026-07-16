const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `                ) : activeTab === "kardex" ? (
                  <KardexReport />`;
const replacement = `                ) : activeTab === "order_list" ? (
                  <OrderList 
                    products={products}
                    categories={productCategories}
                    formatCurrency={formatCurrency}
                    toPersianDigits={toPersianDigits}
                  />
                ) : activeTab === "kardex" ? (
                  <KardexReport />`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log('Added order_list render');
} else {
  console.log('Target not found for rendering');
}
