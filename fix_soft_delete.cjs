const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// Fix innerGetDbData
file = file.replace(
  'const res = await getActivePgPool().query(`SELECT * FROM "${key}" `);',
  'const isSoftDeletable = ["checkbooks", "issued_checks", "received_checks"].includes(key);\n      const res = await getActivePgPool().query(`SELECT * FROM "${key}"${isSoftDeletable ? \' WHERE deleted_at IS NULL\' : \'\'}`);'
);

// Fix KNOWN_TABLES dump in dump-data logic
file = file.replace(
  'for (const key of KNOWN_TABLES) {\n       const res = await getActivePgPool().query(`SELECT * FROM "${key}" `);',
  'for (const key of KNOWN_TABLES) {\n       const isSoftDeletable = ["checkbooks", "issued_checks", "received_checks"].includes(key);\n       const res = await getActivePgPool().query(`SELECT * FROM "${key}"${isSoftDeletable ? \' WHERE deleted_at IS NULL\' : \'\'}`);'
);

fs.writeFileSync('server.ts', file);
