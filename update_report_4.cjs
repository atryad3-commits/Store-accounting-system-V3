const fs = require('fs');

let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '۴.  **داکرایز کردن دیتابیس:** انتقال کامل به PostgreSQL و حذف SQLite محلی برای پایداری بیشتر.',
  '۴.  ✅ **رفع شده:** **داکرایز کردن دیتابیس:** فایل `docker-compose.yml` به پروژه اضافه شد که امکان راه‌اندازی سریع و ایزوله دیتابیس PostgreSQL را به همراه ولوم اختصاصی برای پایداری داده‌ها (Persistent Volume) فراهم می‌کند.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report for item 4");
