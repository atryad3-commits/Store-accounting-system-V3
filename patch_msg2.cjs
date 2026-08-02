const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingChannelsView.tsx', 'utf8');

if (!content.includes('MessageSquare')) {
    content = content.replace('AlertCircle } from "lucide-react";', 'AlertCircle, MessageSquare } from "lucide-react";');
}
fs.writeFileSync('src/components/messaging/MessagingChannelsView.tsx', content);
