const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingChannelsView.tsx', 'utf8');

if (!content.includes('MessageSquare')) {
    content = content.replace('AlertCircle }', 'AlertCircle, MessageSquare }');
}
fs.writeFileSync('src/components/messaging/MessagingChannelsView.tsx', content);
