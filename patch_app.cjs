const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = `
const SendMessageView = React.lazy(() => import('./components/messaging/SendMessageView'));
const MessagingChannelsView = React.lazy(() => import('./components/messaging/MessagingChannelsView'));
const MessagingLogsView = React.lazy(() => import('./components/messaging/MessagingLogsView'));
`;

if (content.includes('const SmsPanel = React.lazy(() => import(\'./components/admin/SmsPanel\'));')) {
    content = content.replace('const SmsPanel = React.lazy(() => import(\'./components/admin/SmsPanel\'));', newImports);
}

const newRoutes = `
  <Route path="/send_message" element={<SendMessageView showNotification={showNotification} />} />
  <Route path="/messaging_channels" element={<MessagingChannelsView showNotification={showNotification} />} />
  <Route path="/messaging_logs" element={<MessagingLogsView showNotification={showNotification} />} />
`;

if (content.includes('<Route path="/sms_panel"')) {
    // Find the exact line
    content = content.replace(/<Route path="\/sms_panel".*?\/>/, newRoutes);
}

fs.writeFileSync('src/App.tsx', content);
