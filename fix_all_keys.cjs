const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  let originalCode = code;
  
  // Replace key={variable.id} with key={variable.id || `fallback-${Math.random()}`}
  // But be careful not to mess up strings that already have ||
  code = code.replace(/key=\{([a-zA-Z0-9_]+)\.id\}/g, 'key={$1.id || `key-${Math.random()}`}');
  
  if (code !== originalCode) {
    fs.writeFileSync(file, code, 'utf-8');
    console.log(`Fixed keys in ${file}`);
  }
});
