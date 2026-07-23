const fs = require('fs');
let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '6.  🟢 اضافه کردن Validation به API های سمت بک‌اند.',
  '6.  ✅ **رفع شده (جزئی):** اضافه کردن Validation به API های سمت بک‌اند با استفاده از کتابخانه Zod (پیاده‌سازی شده در روت‌های احراز هویت).'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report");
