const fs = require('fs');
let content = fs.readFileSync('src/components/profile/LinkPerson.tsx', 'utf8');

content = content.replace(
  "showNotification={(msg, type) => {",
  "confirmAction={(msg, onConfirm) => { if (window.confirm(msg)) onConfirm(); }}\n          showNotification={(msg, type) => {"
);

fs.writeFileSync('src/components/profile/LinkPerson.tsx', content);
