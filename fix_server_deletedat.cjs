const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

file = file.replace(/issuedDate: item.issuedDate \? new Date\(item.issuedDate\) : null,/g, 'issuedDate: item.issuedDate ? new Date(item.issuedDate) : null,\n           deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,');

file = file.replace(/imageUrl: item.imageUrl \|\| null,/g, 'imageUrl: item.imageUrl || null,\n           deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,');

file = file.replace(/description: item.description \|\| null,/g, 'description: item.description || null,\n           deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,');

fs.writeFileSync('server.ts', file);
