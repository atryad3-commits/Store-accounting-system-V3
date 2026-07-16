const fs = require('fs');
let code = fs.readFileSync('src/utils/sidebarData.tsx', 'utf-8');

const target = `{ id: "product_last_prices", label: "آخرین قیمت‌های کالا", roles: ["admin", "accountant", "viewer"] },`;
const replacement = `{ id: "product_last_prices", label: "آخرین قیمت‌های کالا", roles: ["admin", "accountant", "viewer"] },
      { id: "order_list", label: "لیست سفارش خرید (نیازسنجی)", roles: ["admin", "accountant", "viewer"] },`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/utils/sidebarData.tsx', code, 'utf-8');
  console.log('Added order_list to sidebar');
} else {
  console.log('Target not found in sidebarData.tsx');
}
