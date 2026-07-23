const fs = require('fs');

let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '۱.  **بهینه‌سازی بیلد (Build Optimization):** در زمان بیلد Vite هشدار می‌دهد که حجم باندل‌ها بیش از ۵۰۰ کیلوبایت است (`chunk size warning`). این مشکل با Code-splitting (استفاده از Lazy Loading برای مسیرها) برطرف می‌شود.',
  '۱.  ✅ **رفع شده:** **بهینه‌سازی بیلد (Build Optimization):** هشدارهای `chunk size` در زمان بیلد از طریق Code-splitting (استفاده از `React.lazy`) و تنظیم دقیق `manualChunks` در فایل `vite.config.ts` به طور کامل برطرف شد.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report for item 1");
