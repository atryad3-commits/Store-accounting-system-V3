const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

// Update issuedChecks
content = content.replace(
  "  checkNumber: varchar('check_number', { length: 50 }).notNull(),",
  "  checkNumber: varchar('check_number', { length: 50 }).notNull(),\n  sayadId: varchar('sayad_id', { length: 16 }).notNull().default('0000000000000000'),\n  reason: varchar('reason', { length: 50 }),"
);

// Update receivedChecks
content = content.replace(
  "  checkNumber: varchar('check_number', { length: 50 }).notNull(),\n  bankName: varchar('bank_name', { length: 255 }),",
  "  checkNumber: varchar('check_number', { length: 50 }).notNull(),\n  sayadId: varchar('sayad_id', { length: 16 }).notNull().default('0000000000000000'),\n  reason: varchar('reason', { length: 50 }),\n  bankName: varchar('bank_name', { length: 255 }),"
);

// Add check_audit_logs
const auditLogTable = `
export const checkAuditLogs = pgTable('check_audit_logs', {
  id: varchar('id', { length: 50 }).primaryKey(),
  checkId: varchar('check_id', { length: 50 }).notNull(),
  checkType: varchar('check_type', { length: 50 }).notNull(), // 'issued' | 'received'
  action: varchar('action', { length: 100 }), // 'create', 'update', 'status_change', 'delete'
  oldValues: json('old_values'),
  newValues: json('new_values'),
  userId: varchar('user_id', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
`;

if (!content.includes("checkAuditLogs")) {
  content += auditLogTable;
}

fs.writeFileSync('src/db/schema.ts', content);
