const fs = require('fs');
let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '4.  🟡 تفکیک `dataService.ts` به فایل‌های مجزا بر اساس هر موجودیت.',
  '4.  ⚠️ **در حال انجام:** تفکیک `dataService.ts` به دلیل وابستگی‌های عمیق کامپوننت‌ها نیازمند یک فاز تست مجزا است. زیرساخت پوشه `src/services/` برای این کار آماده شده است.'
);

content = content.replace(
  '5.  🟡 نصب و پیاده‌سازی React Query برای حذف کش‌های دستی و مدیریت بهتر وضعیت سرور در فرانت‌اند.',
  '5.  ⚠️ **در حال انجام:** نصب React Query نیازمند تکمیل مورد ۴ (تفکیک سرویس‌ها) است تا در هر فایل سرویس، هوک‌های مربوطه تعریف شوند.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report");
