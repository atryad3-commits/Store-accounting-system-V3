const fs = require('fs');
let file = fs.readFileSync('src/db/schema.ts', 'utf8');

file = file.replace(/export const checkAuditLogs = pgTable\('check_audit_logs', \{\n  id: varchar\('id', \{ length: 50 \}\)\.primaryKey\(\),\n  checkId: varchar\('check_id', \{ length: 50 \}\)\.notNull\(\),\n  checkType: varchar\('check_type', \{ length: 20 \}\)\.notNull\(\), \/\/ 'issued' or 'received'\n  action: varchar\('action', \{ length: 50 \}\)\.notNull\(\),\n  oldValues: text\('old_values'\),\n  newValues: text\('new_values'\),\n  userId: varchar\('user_id', \{ length: 50 \}\),\n  createdAt: timestamp\('created_at'\)\.defaultNow\(\)\.notNull\(\),\n\}\);\n\n/, "");

fs.writeFileSync('src/db/schema.ts', file);
