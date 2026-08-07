const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Add import
if (!code.includes('startAppProcessing')) {
    code = code.replace(
        "import { saveLoans, saveInstallments",
        "import { startAppProcessing, stopAppProcessing } from '../../utils/processingHelper';\nimport { saveLoans, saveInstallments"
    );
}

// In handleCreateLoan
code = code.replace(
    /setIsSubmitting\(true\);\n\s*try \{\n\s*await checkFinancialYear\(formData\.startDate\);/,
    `setIsSubmitting(true);
    startAppProcessing('شروع فرآیند ثبت وام...');
    try {
      await checkFinancialYear(formData.startDate);`
);

code = code.replace(
    /\} catch \(err: any\) \{\n\s*showNotification\(err\.message \|\| 'خطا در ذخیره وام', 'error'\);\n\s*setIsSubmitting\(false\);\n\s*return;\n\s*\}/g,
    `} catch (err: any) {
      showNotification(err.message || 'خطا در ذخیره وام', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }`
);

// We need to stop it when done
code = code.replace(
    /setActiveTab\('list'\);\n\s*setIsSubmitting\(false\);\n\s*\};/g,
    `setActiveTab('list');
    setIsSubmitting(false);
    stopAppProcessing();
  };`
);


// In handlePayInstallment
code = code.replace(
    /setIsSubmitting\(true\);\n\s*try \{\n\s*await checkFinancialYear\(paymentForm\.date\);/,
    `setIsSubmitting(true);
    startAppProcessing('شروع فرآیند ثبت پرداخت...');
    try {
      await checkFinancialYear(paymentForm.date);`
);

code = code.replace(
    /\} catch \(err: any\) \{\n\s*showNotification\(err\.message \|\| 'خطا در ذخیره پرداخت قسط', 'error'\);\n\s*setIsSubmitting\(false\);\n\s*return;\n\s*\}/g,
    `} catch (err: any) {
      showNotification(err.message || 'خطا در ذخیره پرداخت قسط', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }`
);

// We need to stop it when done
code = code.replace(
    /setPaymentForm\(\{\n\s*installmentId: '',\n\s*amount: '',\n\s*date: new Date\(\)\.toLocaleDateString\('fa-IR'\)\.replace\(\/\\\/\/g, '-'\),\n\s*description: '',\n\s*accountId: '',\n\s*\}\);\n\s*setExpandedLoanId\(null\);\n\s*setIsSubmitting\(false\);\n\s*showNotification\('پرداخت با موفقیت ثبت شد', 'success'\);\n\s*\};/g,
    `setPaymentForm({
      installmentId: '',
      amount: '',
      date: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
      description: '',
      accountId: '',
    });
    setExpandedLoanId(null);
    setIsSubmitting(false);
    stopAppProcessing();
    showNotification('پرداخت با موفقیت ثبت شد', 'success');
  };`
);

// Note: checking checkFinancialYear failure in handleCreateLoan
code = code.replace(
    /\} catch \(err: any\) \{\n\s*showNotification\(err\.message \|\| 'تاریخ شروع خارج از سال مالی است\.', 'error'\);\n\s*setIsSubmitting\(false\);\n\s*return;\n\s*\}/g,
    `} catch (err: any) {
      showNotification(err.message || 'تاریخ شروع خارج از سال مالی است.', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }`
);

// Note: checking checkFinancialYear failure in handlePayInstallment
code = code.replace(
    /\} catch \(err: any\) \{\n\s*showNotification\(err\.message \|\| 'تاریخ پرداخت خارج از سال مالی است\.', 'error'\);\n\s*setIsSubmitting\(false\);\n\s*return;\n\s*\}/g,
    `} catch (err: any) {
      showNotification(err.message || 'تاریخ پرداخت خارج از سال مالی است.', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
