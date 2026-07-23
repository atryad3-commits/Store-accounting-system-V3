const fs = require('fs');
let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');

const imports = [];
const statements = [];

const lines = mainTsx.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('import ')) {
    imports.push(lines[i]);
  } else {
    statements.push(lines[i]);
  }
}

// But wait, there are multi-line imports? Let's check.
