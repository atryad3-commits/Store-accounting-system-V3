const fs = require('fs');

// 1. Update schema.ts
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');
if (!schema.includes('person_type')) {
    const personTableMatch = `export const persons = pgTable('persons', {`;
    const personTableReplacement = `export const persons = pgTable('persons', {\n  personType: varchar('person_type', { length: 50 }).default('individual'),\n  taxNumber: varchar('tax_number', { length: 50 }),\n  registrationNumber: varchar('registration_number', { length: 50 }),`;
    schema = schema.replace(personTableMatch, personTableReplacement);

    const newTables = `
export const personCategories = pgTable('person_categories', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 50 }),
  icon: varchar('icon', { length: 50 }),
});

export const personCategoryMappings = pgTable('person_category_mappings', {
  id: varchar('id', { length: 50 }).primaryKey(),
  personId: varchar('person_id', { length: 50 }).notNull(),
  categoryId: varchar('category_id', { length: 50 }).notNull(),
});

export const personRolesMapping = pgTable('person_roles_mapping', {
  id: varchar('id', { length: 50 }).primaryKey(),
  personId: varchar('person_id', { length: 50 }).notNull(),
  roleId: varchar('role_id', { length: 50 }).notNull(),
});
`;
    schema += newTables;
    fs.writeFileSync('src/db/schema.ts', schema);
    console.log('Updated src/db/schema.ts');
} else {
    console.log('schema.ts already updated');
}

// 2. Update server.ts KNOWN_TABLES
let server = fs.readFileSync('server.ts', 'utf8');
if (!server.includes('person_categories')) {
    const knownTablesMatch = `'persons', 'person_contacts', 'person_bank_accounts', 'system_logs',`;
    const knownTablesReplacement = `'persons', 'person_contacts', 'person_bank_accounts', 'system_logs',\n  'person_categories', 'person_category_mappings', 'person_roles_mapping',`;
    server = server.replace(knownTablesMatch, knownTablesReplacement);
    fs.writeFileSync('server.ts', server);
    console.log('Updated server.ts (KNOWN_TABLES)');
} else {
    console.log('server.ts already updated');
}
