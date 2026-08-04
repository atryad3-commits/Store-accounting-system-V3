const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const additionalTables = ['loan_types', 'loan_applications', 'collaterals', 'loan_accounts', 'repayment_schedules', 'repayment_transactions', 'customers_risk_profile'];

for (const t of additionalTables) {
    if (!content.includes("'" + t + "'")) {
        content = content.replace("const KNOWN_TABLES = [", "const KNOWN_TABLES = ['" + t + "', ");
    }
}

fs.writeFileSync('server.ts', content);
