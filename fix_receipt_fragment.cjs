const fs = require('fs');
const file = 'src/components/print/ReceiptPrintTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'return (',
  'return (\n    <>'
);

content = content.replace(
  '</div>\n  );\n}',
  '</div>\n    </>\n  );\n}'
);

fs.writeFileSync(file, content);
