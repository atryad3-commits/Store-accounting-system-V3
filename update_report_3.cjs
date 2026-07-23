const fs = require('fs');

let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '۳.  **مدیریت لاگ‌ها و خطاها:** راه‌اندازی ابزارهایی مانند **Sentry** برای پایش خطاهای سمت کاربر و سرور تا در صورت بروز مشکل، گزارش دقیق ثبت شود.',
  '۳.  ✅ **رفع شده:** **مدیریت لاگ‌ها و خطاها:** پکیج‌های کلاینت و سرور **Sentry** به همراه قابلیت Profiling نصب و پیکربندی شدند. اکنون با مقداردهی \`SENTRY_DSN\` در فایل‌های محیطی، خطاها به طور خودکار مانیتور می‌شوند.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report for item 3");
