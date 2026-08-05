const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/CheckDashboard.tsx', 'utf8');

file = file.replace(
      /<\/div>\s*<CashFlowForecast \/>\s*<\/div>\s*<\/>\s*\);\s*\}/,
      `</div>\n            </div>\n          <CashFlowForecast />\n          </div>\n          </>\n  );\n}`
);

fs.writeFileSync('src/components/financial/checks/CheckDashboard.tsx', file);
