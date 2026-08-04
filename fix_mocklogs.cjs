const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingLogsView.tsx', 'utf-8');

content = content.replace(
  /mockLogs\.filter/g,
  `logs.filter`
);

fs.writeFileSync('src/components/messaging/MessagingLogsView.tsx', content);
