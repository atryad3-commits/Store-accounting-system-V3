const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/updatedAt: new Date\(\), deletedAt: item\.deletedAt \? new Date\(item\.deletedAt\) : null,/g, 'updatedAt: new Date(),');

fs.writeFileSync('server.ts', file);
