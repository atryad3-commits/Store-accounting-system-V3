const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/try \{\n\s*const isSoftDeletable = \["checkbooks", "issued_checks", "received_checks"\].includes\(key\);\n\s*const res = await getActivePgPool\(\)\.query\(\`SELECT \* FROM "\$\{key\}"\$\{isSoftDeletable \? ' WHERE deleted_at IS NULL' : ''\}\`\);\n\s*const parseJSONFields = \(row: any\) => \{/, 
`const isSoftDeletable = ["checkbooks", "issued_checks", "received_checks"].includes(key);
    const parseJSONFields = (row: any) => {
         if (!row) return row;
         for (const k in row) {
            if (typeof row[k] === 'string' && (row[k].startsWith('{') || row[k].startsWith('['))) {
               try { row[k] = JSON.parse(row[k]); } catch(e) { }
            }
         }
         return row;
    };
    try {
      const res = await getActivePgPool().query(\`SELECT * FROM "\${key}"\${isSoftDeletable ? ' WHERE deleted_at IS NULL' : ''}\`);
      `);

fs.writeFileSync('server.ts', code);
