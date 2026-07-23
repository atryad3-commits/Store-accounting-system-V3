const fs = require('fs');
let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '3.  🟠 **مهم:** ریفکتور معماری دیتابیس (جایگزینی مدل Key-Value با جداول Relational نرمال‌سازی شده) با استفاده از Prisma/Drizzle.',
  '3.  ✅ **رفع شده (مهم):** ریفکتور معماری دیتابیس (فاز اول). Drizzle ORM نصب و پیکربندی شد. فایل‌های `schema.ts` و اتصال دیتابیس در `src/db/` ایجاد شدند تا زمینه برای انتقال امن داده‌ها از مدل Key-Value به جداول رابطه‌ای فراهم شود.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report");
