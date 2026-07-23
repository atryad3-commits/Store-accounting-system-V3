const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let imports = [];
  let others = [];
  let inImport = false;
  let currentImport = '';
  let hasChanges = false;

  let firstNonImportMet = false;

  for (let line of lines) {
    let trimmed = line.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('import\t')) {
      if (firstNonImportMet) hasChanges = true;
      if (line.includes(';') || line.includes('from') || trimmed.endsWith('}')) {
        imports.push(line);
      } else {
        inImport = true;
        currentImport = line;
      }
    } else if (inImport) {
      currentImport += '\n' + line;
      if (line.includes(';') || line.includes('from') || trimmed.endsWith('}')) {
        imports.push(currentImport);
        inImport = false;
        currentImport = '';
      }
    } else {
      if (trimmed !== '') {
        firstNonImportMet = true;
      }
      others.push(line);
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, imports.join('\n') + '\n' + others.join('\n'));
    console.log("Fixed", filePath);
  }
}

function walk(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

let files = walk('src');
for (let file of files) {
  processFile(file);
}
console.log("Done");
