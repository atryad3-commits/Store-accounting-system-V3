const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');
content = content.replace(
  'console.log("REACT KEY ERROR CAUGHT:", args);',
  'console.log("REACT KEY ERROR CAUGHT:", args[1] || args);'
);
fs.writeFileSync('src/main.tsx', content);
