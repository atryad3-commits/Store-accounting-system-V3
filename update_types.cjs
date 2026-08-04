const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  "  checkNumber: string;",
  "  checkNumber: string;\n  sayadId: string;\n  reason?: string;"
);

content = content.replace(
  "  checkNumber: string;\n  bankName: string;",
  "  checkNumber: string;\n  sayadId: string;\n  reason?: string;\n  bankName: string;"
);

fs.writeFileSync('src/types.ts', content);
