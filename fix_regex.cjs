const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/SendMessageView.tsx', 'utf-8');
content = content.replace(/manualNumbers\.split\(\/\[,\r?\n\]\/\)/g, "manualNumbers.split(/[\\\\n,]/)");
fs.writeFileSync('src/components/messaging/SendMessageView.tsx', content);
