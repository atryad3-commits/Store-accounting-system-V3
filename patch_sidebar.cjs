const fs = require('fs');
const file = 'src/layouts/AdminLTE/components/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{ id: 'financial_report', label: 'گزارشات', action: () => setActiveTab('financial_report') },",
  "{ id: 'financial_report', label: 'گزارشات', action: () => setActiveTab('financial_report') },\n        { id: 'account_ledger', label: 'دفتر حساب‌ها', action: () => setActiveTab('account_ledger') },"
);

fs.writeFileSync(file, content);
