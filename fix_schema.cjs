const fs = require('fs');
let file = fs.readFileSync('src/db/schema.ts', 'utf8');

const auditLogSchema = `
export const checkAuditLogs = pgTable('check_audit_logs', {
  id: varchar('id', { length: 50 }).primaryKey(),
  checkId: varchar('check_id', { length: 50 }).notNull(),
  checkType: varchar('check_type', { length: 20 }).notNull(), // 'issued' or 'received'
  action: varchar('action', { length: 50 }).notNull(),
  oldValues: text('old_values'),
  newValues: text('new_values'),
  userId: varchar('user_id', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

`;

file = file.replace(/export const issuedChecks = pgTable/, auditLogSchema + "export const issuedChecks = pgTable");
fs.writeFileSync('src/db/schema.ts', file);
