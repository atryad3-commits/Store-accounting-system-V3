const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/key=\{([a-zA-Z0-9_\.]+)\s*\|\|\s*`[^`]*\$\{Math\.random\(\)\}[^`]*`\}/g, 'key={$1}');
  content = content.replace(/key=\{([a-zA-Z0-9_\.]+)\s*\|\|\s*Math\.random\(\)\.toString\(\)\}/g, 'key={$1}');
  content = content.replace(/key=\{([a-zA-Z0-9_\.]+)\s*\?\s*`[^`]*`\s*:\s*`[^`]*\$\{Math\.random\(\)\}[^`]*`\}/g, 'key={$1}');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
