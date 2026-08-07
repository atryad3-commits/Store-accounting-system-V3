const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
    /type: 'given' \| 'received'; \};/,
    "type: 'given' | 'received'; accountId?: string | number; };"
);

fs.writeFileSync('src/types.ts', code);
