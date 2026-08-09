const fs = require('fs');
let content = fs.readFileSync('src/utils/sidebarData.tsx', 'utf-8');

const newLoansMenu = `  {
    id: "loans_management",
    label: "وام و تسهیلات",
    icon: <Calculator className="w-5 h-5" />,
    items: [
      { id: "loans_dashboard", label: "داشبورد وام", roles: ["admin", "accountant", "manager"] },
      { id: "loans_list", label: "لیست وام‌ها", roles: ["admin", "accountant", "manager"] },
      { id: "loans_create", label: "ثبت وام جدید", roles: ["admin", "accountant", "manager"] },
      { id: "loans_payment", label: "پرداخت اقساط", roles: ["admin", "accountant", "manager"] },
      { id: "loans_arrears", label: "معوقات", roles: ["admin", "accountant", "manager"] },
      { id: "loans_reports", label: "گزارشات", roles: ["admin", "accountant", "manager"] },
      { id: "loans_settings", label: "تنظیمات", roles: ["admin", "accountant", "manager"] },
    ],
  },`;

const oldLoansMenuRegex = /\{\s*id:\s*"loans_management"[\s\S]*?items:\s*\[[\s\S]*?\]\s*,\s*\},/;
content = content.replace(oldLoansMenuRegex, newLoansMenu);
fs.writeFileSync('src/utils/sidebarData.tsx', content);
