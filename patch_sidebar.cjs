const fs = require('fs');
let content = fs.readFileSync('src/utils/sidebarData.tsx', 'utf8');

// Add MessageSquare import if not exists
if (!content.includes('MessageSquare')) {
    content = content.replace('import {', 'import { MessageSquare,');
}

const newGroup = `  {
    id: "messaging_system",
    label: "پیامک و اطلاع‌رسانی",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { id: "send_message", label: "ارسال پیام", roles: ["admin", "manager", "accountant"] },
      { id: "messaging_channels", label: "تنظیمات کانال‌ها", roles: ["admin"] },
      { id: "messaging_logs", label: "گزارشات ارسال", roles: ["admin", "manager"] },
    ],
  },
  {
    id: "admin",`;

content = content.replace('  {\n    id: "admin",', newGroup);

// Also remove sms_panel from admin section
content = content.replace('      { id: "sms_panel", label: "تنظیمات پنل پیامک", roles: ["admin"] },\n', '');
// And update CRM filter
content = content.replace('"sms_panel"', '"messaging_system"');

fs.writeFileSync('src/utils/sidebarData.tsx', content);
