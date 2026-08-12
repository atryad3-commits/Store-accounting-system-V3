const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /<Route path="\/loan\/:id" element=\{<LoanCardPage showNotification=\{showNotification\} userRole=\{user\?\.role\} formatCurrency=\{formatCurrency\} \/>\} \/>/,
    `<Route path="/loan/:id" element={<LoanCardPage showNotification={showNotification} userRole={user?.role} formatCurrency={formatCurrency} storeSettings={storeSettings} />} />`
);

fs.writeFileSync('src/App.tsx', code);
