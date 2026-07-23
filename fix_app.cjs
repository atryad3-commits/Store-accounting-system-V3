const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Separate all import statements and place them at the very top.
let lines = appTsx.split('\n');
let imports = [];
let others = [];
let inImport = false;
let currentImport = '';

for (let line of lines) {
  if (line.trim().startsWith('import ') || line.trim().startsWith('import\t')) {
    if (line.includes(';') || line.includes('from') || line.endsWith('}')) {
      imports.push(line);
    } else {
      inImport = true;
      currentImport = line;
    }
  } else if (inImport) {
    currentImport += '\n' + line;
    if (line.includes(';') || line.includes('from') || line.endsWith('}')) {
      imports.push(currentImport);
      inImport = false;
      currentImport = '';
    }
  } else {
    others.push(line);
  }
}

fs.writeFileSync('src/App.tsx', imports.join('\n') + '\n' + others.join('\n'));
console.log("Fixed App.tsx");
