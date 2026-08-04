const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingChannelsView.tsx', 'utf-8');

content = content.replace(
  `await fetch('/api/data', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ key: 'sms_providers', data: payload })
           });`,
  `await fetch('/api/data/sms_providers/append', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(payload)
           });`
);
fs.writeFileSync('src/components/messaging/MessagingChannelsView.tsx', content);
