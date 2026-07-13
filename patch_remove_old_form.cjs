const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = content.indexOf('case "create_receive_receipt":');
const endIndex = content.indexOf('case "list_receive_receipt":');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
}

fs.writeFileSync('src/App.tsx', content);
