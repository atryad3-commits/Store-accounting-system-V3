const fs = require('fs');
let content = fs.readFileSync('project_review_report.md', 'utf8');

if (!content.includes('پشتیبانی از تصویر کالا')) {
   content += '\n\n7. ✅ **رفع شده (ویژگی جا افتاده):** اضافه شدن امکان درج لینک تصویر (`imageUrl`) در فرم افزودن سریع کالا و نمایش آن در مودال استعلام قیمت سریع (Quick Price Inquiry) و جدول کالاها.';
   fs.writeFileSync('project_review_report.md', content);
   console.log("Updated report with item 7");
}
