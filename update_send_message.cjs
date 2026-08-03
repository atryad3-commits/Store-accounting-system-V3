const fs = require('fs');

let content = fs.readFileSync('src/components/messaging/SendMessageView.tsx', 'utf-8');

// Update Layout
content = content.replace(
  'className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-6rem)]"',
  'className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-6rem)] lg:px-6"'
);

// Update Modal Z-Index
content = content.replace(
  'className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"',
  'className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"'
);

content = content.replace(
  'className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-50 shadow-2xl z-50 flex flex-col border-l border-slate-200"',
  'className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-50 shadow-2xl z-[101] flex flex-col border-l border-slate-200"'
);

// Replace handleSend
const oldHandleSend = `  const handleSend = () => {
    if (!messageText.trim()) {
      if (showNotification) showNotification('متن پیام نمی‌تواند خالی باشد', 'error');
      return;
    }
    if (selectedRecipients.length === 0 && selectedGroups.length === 0 && !manualNumbers) {
      if (showNotification) showNotification('حداقل یک گیرنده باید انتخاب شود', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (showNotification) {
        showNotification(sendMode === 'scheduled' ? 'پیام با موفقیت زمان‌بندی شد' : 'پیام با موفقیت در صف ارسال قرار گرفت', 'success');
      }
      // Reset form optionally
    }, 1500);
  };`;

const newHandleSend = `  const handleSend = async () => {
    if (!messageText.trim()) {
      if (showNotification) showNotification('متن پیام نمی‌تواند خالی باشد', 'error');
      return;
    }
    if (selectedRecipients.length === 0 && selectedGroups.length === 0 && !manualNumbers) {
      if (showNotification) showNotification('حداقل یک گیرنده باید انتخاب شود', 'error');
      return;
    }

    setIsSending(true);

    try {
      const messagesToSave: any[] = [];
      const timestamp = new Date().toISOString();

      if (sendMode === 'single' || sendMode === 'bulk' || sendMode === 'scheduled') {
         if (manualNumbers) {
            const numbers = manualNumbers.split(/[,\n]/).map(n => n.trim()).filter(n => n);
            numbers.forEach(num => {
               messagesToSave.push({
                  id: Math.random().toString(36).substring(2, 15),
                  recipientType: 'manual',
                  recipientNumber: num,
                  recipientName: 'شماره دستی',
                  messageBody: messageText,
                  messageLength: messageText.length,
                  status: sendMode === 'scheduled' ? 'scheduled' : 'pending',
                  priority: 1,
                  scheduledAt: sendMode === 'scheduled' ? timestamp : null,
                  createdAt: timestamp
               });
            });
         }
         
         selectedRecipients.forEach(rec => {
            messagesToSave.push({
                  id: Math.random().toString(36).substring(2, 15),
                  recipientType: 'contact',
                  recipientId: rec.id,
                  recipientNumber: rec.phone,
                  recipientName: rec.name,
                  messageBody: messageText,
                  messageLength: messageText.length,
                  status: sendMode === 'scheduled' ? 'scheduled' : 'pending',
                  priority: 1,
                  createdAt: timestamp
               });
         });
      } else if (sendMode === 'group') {
         const groupPersons = (persons || []).filter((p: any) => selectedGroups.includes(p.group));
         
         groupPersons.forEach((rec: any) => {
            messagesToSave.push({
                  id: Math.random().toString(36).substring(2, 15),
                  recipientType: 'contact',
                  recipientId: rec.id,
                  recipientNumber: rec.phone || rec.mobile,
                  recipientName: rec.firstName || rec.lastName ? \`\${rec.firstName || ''} \${rec.lastName || ''}\`.trim() : (rec.companyName || rec.title || 'نامشخص'),
                  messageBody: messageText,
                  messageLength: messageText.length,
                  status: 'pending',
                  priority: 1,
                  createdAt: timestamp
               });
         });
      }
      
      const operations = messagesToSave.map(msg => ({
         key: 'sms_messages',
         type: 'append',
         data: msg
      }));
      
      await fetch('/api/data/batch', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ operations })
      });

      if (showNotification) {
        showNotification(sendMode === 'scheduled' ? 'پیام با موفقیت زمان‌بندی شد' : 'پیام‌ها با موفقیت در صف ارسال قرار گرفتند', 'success');
      }

      setMessageText('');
      setSelectedRecipients([]);
      setSelectedGroups([]);
      setManualNumbers('');
      
    } catch (err) {
      console.error(err);
      if (showNotification) showNotification('خطا در ذخیره پیام‌ها', 'error');
    } finally {
      setIsSending(false);
    }
  };`;

// In case the oldHandleSend has different indentation, let's use regex.
const regex = /const handleSend = \(\) => \{[\s\S]*?\}, 1500\);\s*\};\n?/m;
content = content.replace(regex, newHandleSend + '\n');

fs.writeFileSync('src/components/messaging/SendMessageView.tsx', content);
