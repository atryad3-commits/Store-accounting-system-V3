const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingLogsView.tsx', 'utf-8');

content = content.replace(
  /const fetchLogs = async \(\) => \{[\s\S]*?\} catch \(err\) \{/g,
  `const fetchLogs = async () => {
    try {
      const res = await fetch('/api/data/sms_messages');
      const data = await res.json();
      if (Array.isArray(data)) {
         setLogs(data.map(d => {
            let status = d.status;
            if (status === 'sent') status = 'delivered';
            if (status === 'success') status = 'delivered';
            if (status === 'error') status = 'failed';
            return {
              id: d.id,
              recipient: { 
                 name: d.recipientName || 'نامشخص', 
                 contact: d.recipientNumber || 'نامشخص'
              },
              sender: 'سیستم',
              content: d.messageBody || '',
              status: status as any,
              channelType: 'sms',
              channelName: d.recipientType === 'manual' ? 'ارسال دستی' : 'مخاطبین',
              createdAt: d.createdAt || new Date().toISOString(),
              error: d.status === 'failed' ? 'خطا در ارسال پیام' : undefined
            };
         }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {`
);

fs.writeFileSync('src/components/messaging/MessagingLogsView.tsx', content);
