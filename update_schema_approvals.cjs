const fs = require('fs');
let file = fs.readFileSync('src/db/schema.ts', 'utf8');

file = file.replace(/export const issuedChecks = pgTable\('issued_checks', \{/, `export const issuedChecks = pgTable('issued_checks', {
  creatorId: varchar('creator_id', { length: 50 }),
  approvalStatus: varchar('approval_status', { length: 50 }).default('approved'), // pending_approval, approved, rejected
  approvedById: varchar('approved_by_id', { length: 50 }),
  approvedAt: timestamp('approved_at'),`);

file = file.replace(/export const receivedChecks = pgTable\('received_checks', \{/, `export const receivedChecks = pgTable('received_checks', {
  creatorId: varchar('creator_id', { length: 50 }),
  approvalStatus: varchar('approval_status', { length: 50 }).default('approved'), // pending_approval, approved, rejected
  approvedById: varchar('approved_by_id', { length: 50 }),
  approvedAt: timestamp('approved_at'),`);

fs.writeFileSync('src/db/schema.ts', file);
