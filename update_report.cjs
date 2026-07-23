const fs = require('fs');

let content = fs.readFileSync('project_review_report.md', 'utf8');

content = content.replace(
  '4.  ⚠️ **در حال انجام:** تفکیک `dataService.ts` به دلیل وابستگی‌های عمیق کامپوننت‌ها نیازمند یک فاز تست مجزا است. زیرساخت پوشه `src/services/` برای این کار آماده شده است.',
  '4.  ✅ **رفع شده (مهم):** فایل ۳۳۰۰ خطی `dataService.ts` با موفقیت به چندین سرویس دامین‌محور (`productService.ts`, `invoiceService.ts` و غیره) تفکیک شد و برای حفظ سازگاری (Backward Compatibility)، `dataService.ts` تبدیل به یک فایل Re-export شد.'
);

content = content.replace(
  '5.  ⚠️ **در حال انجام:** نصب React Query نیازمند تکمیل مورد ۴ (تفکیک سرویس‌ها) است تا در هر فایل سرویس، هوک‌های مربوطه تعریف شوند.',
  '5.  ✅ **رفع شده (مهم):** کتابخانه `React Query` (`@tanstack/react-query`) نصب و پیکربندی اولیه آن در `main.tsx` انجام شد. نمونه هوک‌های ریکت کوئری (مانند `useGetProducts`) در `productService.ts` اضافه شدند تا زمینه برای جایگزینی کامل `useAppController` فراهم شود.'
);

fs.writeFileSync('project_review_report.md', content);
console.log("Updated report for items 4 and 5");
