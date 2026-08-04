const fs = require('fs');
const file = 'src/db/schema.ts';
let content = fs.readFileSync(file, 'utf8');

const newTables = `
// --- Check Management Tables ---
export const checkbooks = pgTable('checkbooks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  accountId: varchar('account_id', { length: 50 }),
  bankName: varchar('bank_name', { length: 255 }),
  startNumber: varchar('start_number', { length: 50 }),
  endNumber: varchar('end_number', { length: 50 }),
  totalLeaves: integer('total_leaves'),
  issuedDate: timestamp('issued_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const issuedChecks = pgTable('issued_checks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  checkbookId: varchar('checkbook_id', { length: 50 }),
  checkNumber: varchar('check_number', { length: 50 }).notNull(),
  amount: numeric('amount').notNull(),
  issueDate: timestamp('issue_date'),
  dueDate: timestamp('due_date'),
  payeeId: varchar('payee_id', { length: 50 }),
  status: varchar('status', { length: 50 }).default('blank'), // 'blank' | 'issued' | 'cashed' | 'bounced' | 'cancelled'
  receiptNumber: varchar('receipt_number', { length: 255 }),
  assignedToId: varchar('assigned_to_id', { length: 50 }),
  bankAccountId: varchar('bank_account_id', { length: 50 }),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  statusDueDateIdx: index('idx_issued_checks_status_due_date').on(table.status, table.dueDate),
}));

export const receivedChecks = pgTable('received_checks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  checkNumber: varchar('check_number', { length: 50 }).notNull(),
  bankName: varchar('bank_name', { length: 255 }),
  branchName: varchar('branch_name', { length: 255 }),
  amount: numeric('amount').notNull(),
  receiveDate: timestamp('receive_date'),
  dueDate: timestamp('due_date'),
  payerId: varchar('payer_id', { length: 50 }),
  status: varchar('status', { length: 50 }).default('received'), // 'received' | 'deposited' | 'cashed' | 'bounced' | 'returned' | 'assigned' | 'bounced_assigned'
  receiptNumber: varchar('receipt_number', { length: 255 }),
  assignedToId: varchar('assigned_to_id', { length: 50 }),
  accountId: varchar('account_id', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  statusDueDateIdx: index('idx_received_checks_status_due_date').on(table.status, table.dueDate),
}));
`;

if (!content.includes("export const checkbooks")) {
    content += newTables;
    fs.writeFileSync(file, content);
    console.log("Added checks tables to schema.ts");
} else {
    console.log("Already added");
}
