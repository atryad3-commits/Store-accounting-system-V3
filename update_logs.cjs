const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingLogsView.tsx', 'utf-8');

content = content.replace(
  'const [searchTerm, setSearchTerm] = useState("");',
  `const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<MessageLog[]>([]);
  
  React.useEffect(() => {
     fetchLogs();
  }, []);
  
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/data/sms_messages');
      const data = await res.json();
      if (Array.isArray(data)) {
         setLogs(data.map(d => ({
            id: d.id,
            time: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('fa-IR') : 'نامشخص',
            channel: d.recipientType === 'manual' ? 'ارسال دستی' : 'مخاطبین',
            recipient: d.recipientNumber || 'نامشخص',
            status: d.status === 'pending' || d.status === 'queued' ? 'queued' : (d.status === 'sent' || d.status === 'delivered' ? 'success' : 'failed'),
            error: d.status === 'failed' ? 'خطا در ارسال' : null,
            content: d.messageBody || '',
            name: d.recipientName || ''
         })));
      }
    } catch (err) {
      console.error(err);
      setLogs(mockLogs as any[]);
    }
  };`
);

content = content.replace(
  /const filteredLogs = useMemo\(\(\) => \{\n    return mockLogs/g,
  `const filteredLogs = useMemo(() => {
    return logs`
);

content = content.replace(
  /const stats = useMemo\(\(\) => \{\n    const total = mockLogs\.length;\n    const delivered = mockLogs\.filter\(l => l\.status === 'delivered'\)\.length;\n    const failed = mockLogs\.filter\(l => l\.status === 'failed'\)\.length;\n    const pending = mockLogs\.filter\(l => l\.status === 'pending' \|\| l\.status === 'queued'\)\.length;/g,
  `const stats = useMemo(() => {
    const total = logs.length;
    const delivered = logs.filter(l => l.status === 'success' || l.status === 'delivered').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const pending = logs.filter(l => l.status === 'pending' || l.status === 'queued').length;`
);

fs.writeFileSync('src/components/messaging/MessagingLogsView.tsx', content);
