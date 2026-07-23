const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');
console.log(s.includes("import { validateData }"));
