const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/try \{\n\s*const res = await getActivePgPool\(\)\.query\(\`SELECT \* FROM "\$\{key\}"\$\{isSoftDeletable \? ' WHERE deleted_at IS NULL' : ''\}\`\);\n\s*if \(\!row\) return row;\n\s*for \(const k in row\) \{\n\s*if \(typeof row\[k\] === 'string' && \(row\[k\]\.startsWith\('\{'\) \|\| row\[k\]\.startsWith\('\['\)\)\) \{\n\s*try \{ row\[k\] = JSON\.parse\(row\[k\]\); \} catch\(e\) \{ \}\n\s*\}\n\s*\}\n\s*return row;\n\s*\};\n/, `try {
      const res = await getActivePgPool().query(\`SELECT * FROM "\${key}"\${isSoftDeletable ? ' WHERE deleted_at IS NULL' : ''}\`);
`);

fs.writeFileSync('server.ts', code);
