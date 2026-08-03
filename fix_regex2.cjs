const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/SendMessageView.tsx', 'utf-8');
content = content.replace(/split\(\/\[,\\n\r?\n\s*\]\/\)/g, "split(/[\\\\n,]/)");
content = content.replace("split(/[,\\n\n  ]/)", "split(/[\\\\n,]/)");
fs.writeFileSync('src/components/messaging/SendMessageView.tsx', content);
