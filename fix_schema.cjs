const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

const tableDef = `
export const personGroups = pgTable('person_groups', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 50 }),
  icon: varchar('icon', { length: 50 }),
  parentId: varchar('parent_id', { length: 50 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
});
`;

if (!code.includes('export const personGroups')) {
  code += tableDef;
  fs.writeFileSync('src/db/schema.ts', code);
}
