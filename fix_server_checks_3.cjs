const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/checkNumber: String\(item.checkNumber \|\| item.id\),/g, "checkNumber: String(item.checkNumber || item.id),\n           sayadId: item.sayadId || '0000000000000000',\n           reason: item.reason || null,");

fs.writeFileSync('server.ts', file);
