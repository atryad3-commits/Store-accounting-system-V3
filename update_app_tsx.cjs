const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
    /currentUser=\{user\?\.name \|\| "کاربر سیستم"\}/,
    `currentUser={user?.name || "کاربر سیستم"}\n                        formatCurrency={formatCurrency}`
);
fs.writeFileSync('src/App.tsx', code);
