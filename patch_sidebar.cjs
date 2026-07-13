const fs = require('fs');
let content = fs.readFileSync('src/utils/sidebarData.tsx', 'utf-8');

const newItem = `      {
        id: "product_last_prices",
        label: "آخرین قیمت‌های کالا",
        roles: ["admin", "accountant", "viewer"],
      },
`;

content = content.replace(
  'id: "kardex",',
  'id: "product_last_prices", label: "آخرین قیمت‌های کالا", roles: ["admin", "accountant", "viewer"] },\n      {\n        id: "kardex",'
);
fs.writeFileSync('src/utils/sidebarData.tsx', content);
