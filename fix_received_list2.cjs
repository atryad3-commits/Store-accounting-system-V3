const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/ReceivedChecksList.tsx', 'utf8');

// I'll just remove the last </div> before </>
file = file.replace(/<\/div>\s*<\/>\s*\);\s*\}\s*$/, "\n    </>\n  );\n}\n");

fs.writeFileSync('src/components/financial/checks/ReceivedChecksList.tsx', file);
