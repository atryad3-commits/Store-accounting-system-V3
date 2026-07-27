const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

code = code.replace(/const saveInvoiceData = async \(/, "const saveInvoiceData = async ("); // just a check
code = code.replace(/setSubmitting\(true\);\n    setSuccessMsg\(\"\"\);/, "setSubmitting(true);\n    setSuccessMsg(\"\");\n    startAppProcessing('شروع فرآیند ثبت فاکتور...');\n    await new Promise(r => setTimeout(r, 400));");

code = code.replace(/const payload = customPayload\n      \? \{/g, "updateAppProcessing('آماده‌سازی اطلاعات فاکتور...');\n    await new Promise(r => setTimeout(r, 400));\n    const payload = customPayload\n      ? {");

code = code.replace(/\/\/ 1\. If it's a sale and not a draft/g, "updateAppProcessing('اعتبارسنجی موجودی و انبار...');\n    await new Promise(r => setTimeout(r, 400));\n    // 1. If it's a sale and not a draft");

code = code.replace(/\/\/ 3\. If there is an invoice payment/g, "updateAppProcessing('بررسی دریافت/پرداخت...');\n    // 3. If there is an invoice payment");

code = code.replace(/setSubmitting\(false\);/g, "setSubmitting(false);\n      stopAppProcessing();");

fs.writeFileSync('src/hooks/useAppController.tsx', code);
