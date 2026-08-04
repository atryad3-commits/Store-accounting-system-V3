const fs = require('fs');
let content = fs.readFileSync('src/components/messaging/MessagingChannelsView.tsx', 'utf-8');
content = content.replace(
  /const handleReorder = \(newOrder: ChannelConfig\[\]\) => \{[\s\S]*?\};\n/g,
  `const handleReorder = async (newOrder: ChannelConfig[]) => {
    const updatedChannels = newOrder.map((ch, index) => ({
      ...ch,
      priority: index + 1
    }));
    setChannels(updatedChannels);
    
    try {
      const operations = updatedChannels.map(ch => ({
         key: 'sms_providers',
         type: 'append',
         data: {
           id: ch.id,
           priority: ch.priority
         }
      }));
      
      await fetch('/api/data/batch', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ operations })
      });
      if (showNotification) showNotification("اولویت کانال‌ها بروزرسانی شد", "success");
    } catch (err) {
      console.error(err);
      if (showNotification) showNotification("خطا در بروزرسانی اولویت‌ها", "error");
    }
  };
`
);

fs.writeFileSync('src/components/messaging/MessagingChannelsView.tsx', content);
