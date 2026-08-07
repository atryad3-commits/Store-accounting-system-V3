const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
    /status: 'active' \| 'completed' \| 'overdue';/,
    "status: 'requested' | 'incomplete' | 'completed_dossier' | 'approved' | 'active' | 'completed' | 'overdue';"
);

fs.writeFileSync('src/types.ts', code);
