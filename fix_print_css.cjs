const fs = require('fs');
const file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'position: relative !important;',
  'position: absolute !important;\n    left: 0 !important;\n    top: 0 !important;'
);

fs.writeFileSync(file, content);
