const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/IssuedChecksList.tsx', 'utf8');

file = file.replace(/<\/div>\s*<\/>\s*\);\s*\}\s*$/, "\n    </>\n  );\n}\n");

fs.writeFileSync('src/components/financial/checks/IssuedChecksList.tsx', file);
