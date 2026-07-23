const fs = require('fs');
let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');

// Replace any occurrence of `}); import` with `}); \nimport`
mainTsx = mainTsx.replace(/; ?import/g, ';\nimport');
mainTsx = mainTsx.replace(/}import/g, '}\nimport');

// Separate all import statements and place them at the very top.
let lines = mainTsx.split('\n');
let imports = [];
let others = [];
let inImport = false;
let currentImport = '';

for (let line of lines) {
  if (line.trim().startsWith('import ') || line.trim().startsWith('import\t')) {
    if (line.includes(';') || line.includes('from')) {
      imports.push(line);
    } else {
      inImport = true;
      currentImport = line;
    }
  } else if (inImport) {
    currentImport += '\n' + line;
    if (line.includes(';') || line.includes('from')) {
      imports.push(currentImport);
      inImport = false;
      currentImport = '';
    }
  } else {
    others.push(line);
  }
}

fs.writeFileSync('src/main.tsx', imports.join('\n') + '\n' + others.join('\n'));
console.log("Fixed main.tsx");
