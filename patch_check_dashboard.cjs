const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/CheckDashboard.tsx', 'utf8');

if (!file.includes('CashFlowForecast')) {
   file = file.replace(/export function CheckDashboard/, "import { CashFlowForecast } from './CashFlowForecast';\nexport function CheckDashboard");
   
   file = file.replace(
      /<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\);\s*\}/,
      `</div>\n          <CashFlowForecast />\n          </div>\n          </>\n  );\n}`
   );
}
fs.writeFileSync('src/components/financial/checks/CheckDashboard.tsx', file);
