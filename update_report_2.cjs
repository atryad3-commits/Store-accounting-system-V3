const fs = require('fs');

let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '۲.  **اعتبارسنجی داده‌ها (Data Validation):** در سمت سرور هیچ‌گونه اعتبارسنجی (Validation) روی داده‌های ورودی انجام نمی‌شود. استفاده از کتابخانه‌هایی مثل **Zod** یا **Yup** هم در فرانت‌اند و هم بک‌اند ضروری است.',
  '۲.  ✅ **رفع شده:** **اعتبارسنجی داده‌ها (Data Validation):** با استفاده از کتابخانه **Zod** در فرانت‌اند (برای فرم‌های مهم مثل اشخاص و کالاها) و یک Middleware جامع در سمت بک‌اند (`server.ts`)، اعتبارسنجی ساختاریافته روی داده‌های ورودی پیاده‌سازی شد.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report for item 2");
