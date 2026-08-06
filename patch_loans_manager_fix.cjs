const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
/گزارشات\n\s+<button/m,
"گزارشات\n          </button>\n          <button"
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
