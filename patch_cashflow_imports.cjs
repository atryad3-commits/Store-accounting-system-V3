const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// Replace schema.accounts with accounts, schema.cashboxes with cashboxes, schema.issuedChecks with issuedChecks, schema.receivedChecks with receivedChecks
file = file.replace(/schema\.accounts/g, 'accounts');
file = file.replace(/schema\.cashboxes/g, 'cashboxes');
file = file.replace(/schema\.issuedChecks/g, 'issuedChecks');
file = file.replace(/schema\.receivedChecks/g, 'receivedChecks');

// Add accounts and cashboxes to imports
file = file.replace(
  /import \{ checkbooks, issuedChecks, receivedChecks, checkAuditLogs, notifications \} from '\.\/src\/db\/schema';/,
  "import { checkbooks, issuedChecks, receivedChecks, checkAuditLogs, notifications, accounts, cashboxes } from './src/db/schema';"
);

if (file.includes('import { eq, isNull, sql, desc, asc } from')) {
    file = file.replace(/import \{ eq, isNull, sql, desc, asc \} from 'drizzle-orm';/, "import { eq, isNull, sql, desc, asc, inArray } from 'drizzle-orm';");
}

fs.writeFileSync('server.ts', file);
