const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingChannelsView.tsx', 'utf-8');

// Replace mockChannels usage with fetching
content = content.replace(
  'const [channels, setChannels] = useState<ChannelConfig[]>(mockChannels.sort((a,b) => a.priority - b.priority));',
  `const [channels, setChannels] = useState<ChannelConfig[]>([]);

  React.useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/data/sms_providers');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setChannels(data.map(d => ({
          id: d.id,
          name: d.name,
          type: d.channelType || 'sms_panel',
          isEnabled: d.isActive ?? true,
          priority: d.priority || 1,
          status: 'connected',
          lastUsed: 'نامشخص',
          config: { apiKey: d.apiKey, apiEndpoint: d.apiEndpoint, apiSecret: d.apiSecret, lineNumber: d.senderNumber },
          dailyRateLimit: d.dailyLimit || 10000,
          activeHours: { start: "00:00", end: "23:59" },
          defaultSenderId: d.senderNumber || ""
        })).sort((a: any, b: any) => a.priority - b.priority));
      } else {
         setChannels(mockChannels.sort((a,b) => a.priority - b.priority));
      }
    } catch (err) {
      console.error(err);
      setChannels(mockChannels.sort((a,b) => a.priority - b.priority));
    }
  };`
);

content = content.replace(
  /const handleSave = \(\) => \{[\s\S]*?\}\n  \};\n/,
  `const handleSave = async () => {
    if (editingChannel) {
      if (confirm("آیا از ذخیره این تغییرات حیاتی اطمینان دارید؟ (نیاز به تایید مدیر)")) {
        try {
           const payload = {
              id: editingChannel.id,
              name: editingChannel.name,
              slug: editingChannel.id,
              channelType: editingChannel.type,
              apiEndpoint: editingChannel.config?.apiEndpoint,
              apiKey: editingChannel.config?.apiKey,
              apiSecret: editingChannel.config?.apiSecret,
              senderNumber: editingChannel.config?.lineNumber || editingChannel.defaultSenderId,
              priority: editingChannel.priority,
              isActive: editingChannel.isEnabled,
              dailyLimit: editingChannel.dailyRateLimit
           };
           
           await fetch('/api/data', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ key: 'sms_providers', data: payload })
           });

           setChannels(channels.map(ch => ch.id === editingChannel.id ? editingChannel : ch));
           setEditingChannel(null);
           if (showNotification) showNotification("تنظیمات کانال با موفقیت ذخیره شد", "success");
        } catch (err) {
           console.error(err);
           if (showNotification) showNotification("خطا در ذخیره تنظیمات کانال", "error");
        }
      }
    }
  };
`
);

fs.writeFileSync('src/components/messaging/MessagingChannelsView.tsx', content);
