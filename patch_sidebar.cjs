const fs = require('fs');
const path = 'src/utils/sidebarData.tsx';
let data = fs.readFileSync(path, 'utf-8');

data = data.replace(/\{\s*id:\s*"stocktaking",\s*label:\s*"انبارگردانی",\s*roles:\s*\["admin",\s*"manager"\],\s*\},\n?/g, '');

const insertStr = `      {
        id: "list_warehouse_docs",
        label: "لیست اسناد انبار",
        roles: ["admin", "accountant"],
      },
      {
        id: "stocktaking",
        label: "انبارگردانی",
        roles: ["admin", "manager"],
      },`;

data = data.replace(/\{\s*id:\s*"list_warehouse_docs",\s*label:\s*"لیست اسناد انبار",\s*roles:\s*\["admin",\s*"accountant"\],\s*\},/g, insertStr);

fs.writeFileSync(path, data, 'utf-8');
console.log('patched');
