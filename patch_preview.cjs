const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

// 1. Add state for previewData
const stateRegex = /const \[isSubmitting, setIsSubmitting\] = useState\(false\);/;
const stateAddition = `const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<{loan: Loan, installments: Installment[]} | null>(null);`;
content = content.replace(stateRegex, stateAddition);

// 2. Modify handleCreateLoan to open preview
const createFnRegex = /const handleCreateLoan = async \(\) => \{[\s\S]*?addSystemLog\('ADD_LOAN'[\s\S]*?stopAppProcessing\(\);\n  \};/;

const newCreateFn = `const handleCreateLoan = async () => {
    if (isSubmitting) return;
    if (userRole !== 'admin' && userRole !== 'manager' && userRole !== 'accountant') {
      showNotification('شما دسترسی ثبت وام را ندارید.', 'error');
      return;
    }
    if (!formData.personId || formData.amount === '' || formData.totalInstallments === '' || formData.installmentAmount === '' || !formData.accountId) {
      showNotification('لطفا تمام فیلدهای ضروری را پر کنید.', 'error');
      return;
    }
    const amountNum = Number(formData.amount);
    const instCount = Number(formData.totalInstallments);
    const instAmount = Number(formData.installmentAmount);
    if (amountNum <= 0) {
      showNotification('مبلغ وام باید بیشتر از صفر باشد.', 'error');
      return;
    }
    if (instCount <= 0 || !Number.isInteger(instCount)) {
      showNotification('تعداد اقساط باید یک عدد صحیح و بزرگتر از صفر باشد.', 'error');
      return;
    }
    if (instAmount <= 0) {
      showNotification('مبلغ قسط باید بیشتر از صفر باشد.', 'error');
      return;
    }
    if (instCount * instAmount < amountNum) {
      showNotification('مجموع اقساط نمی‌تواند کمتر از اصل وام باشد.', 'error');
      return;
    }
    if (formData.interestRate !== '' && Number(formData.interestRate) < 0) {
      showNotification('نرخ سود نمی‌تواند منفی باشد.', 'error');
      return;
    }
    setIsSubmitting(true);
    startAppProcessing('اعتبارسنجی وام...');
    try {
      await checkFinancialYear(formData.startDate);
    } catch (err: any) {
      showNotification(err.message || 'تاریخ خارج از سال مالی فعال است.', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }

    const loanId = 'loan_' + Date.now();
    const loanNumber = Math.floor(10000 + Math.random() * 90000).toString();
    const newLoan: Loan = {
      id: loanId,
      loanNumber,
      personId: formData.personId,
      amount: amountNum,
      interestRate: formData.interestRate === '' ? undefined : Number(formData.interestRate),
      frequency: formData.frequency,
      startDate: formData.startDate,
      totalInstallments: instCount,
      installmentAmount: instAmount,
      description: formData.description,
      status: 'requested', // Initial status
      type: formData.type,
      accountId: formData.accountId,
    };
    
    // To english numbers
    const toEnglishNumbers = (str: string) => {
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return str.split('').map(c => {
        const index = persianNumbers.indexOf(c);
        return index !== -1 ? index : c;
      }).join('');
    };

    let [initY, initM, initD] = toEnglishNumbers(formData.startDate).replace(/\\//g, '-').split('-').map(Number);
    if (isNaN(initY) || isNaN(initM) || isNaN(initD)) {
        initY = 1403; initM = 1; initD = 1; // fallback
    }

    const newInstallments: Installment[] = [];
    const stepMonths = formData.frequency === 'yearly' ? 12 : formData.frequency === 'quarterly' ? 3 : 1;
    
    for (let i = 0; i < instCount; i++) {
      let totalMonths = initM + ((i + 1) * stepMonths);
      let instY = initY + Math.floor((totalMonths - 1) / 12);
      let instM = ((totalMonths - 1) % 12) + 1;
      
      let finalD = initD;
      if (instM === 12 && finalD > 29) finalD = 29;
      if (instM > 6 && finalD === 31) finalD = 30;
      let dueDateStr = instY + '-' + instM.toString().padStart(2, '0') + '-' + finalD.toString().padStart(2, '0');
      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        installmentNumber: i + 1,
        loanId: loanId,
        dueDate: dueDateStr,
        amount: instAmount,
        status: 'pending',
      });
    }

    setPreviewData({ loan: newLoan, installments: newInstallments });
    setIsSubmitting(false);
    stopAppProcessing();
  };

  const handleFinalSubmitLoan = async () => {
    if (!previewData) return;
    setIsSubmitting(true);
    startAppProcessing('در حال ثبت نهایی وام...');
    const newInstsList = [...installments, ...previewData.installments];
    const newLoansList = [...loans, previewData.loan];
    
    setLoans(newLoansList);
    setInstallments(newInstsList);
    
    try {
      await saveLoans(newLoansList);
      await saveInstallments(newInstsList);
      if (typeof addSystemLog !== 'undefined') {
        await addSystemLog('ADD_LOAN', \`ثبت وام جدید به مبلغ \${previewData.loan.amount} برای شخص \${previewData.loan.personId}\`, 'Loan', previewData.loan.id);
      }
      showNotification('وام با موفقیت ثبت شد.', 'success');
    } catch (err: any) {
      showNotification(err.message || 'خطا در ذخیره وام', 'error');
      setIsSubmitting(false);
      stopAppProcessing();
      return;
    }
    
    setFormData({
      personId: '',
      amount: '',
      interestRate: '',
      startDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
      totalInstallments: '',
      installmentAmount: '',
      description: '',
      type: 'given',
      accountId: '',
    });
    setPreviewData(null);
    navigate('/loans_list');
    setIsSubmitting(false);
    stopAppProcessing();
  };`;
content = content.replace(createFnRegex, newCreateFn);

// 3. Add the preview modal in the render
const closingBraceRegex = /\{printingLoanId && \(\s*<InstallmentBookletPrint/;
const previewModalRender = `{previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-800">پیش‌نمایش اقساط وام</h2>
              <button onClick={() => setPreviewData(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                 <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs text-gray-500 font-bold block mb-1">مبلغ وام</span>
                     <span className="text-lg font-black text-gray-800">{formatCurrency(previewData.loan.amount)} {storeSettings?.currency || 'تومان'}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs text-gray-500 font-bold block mb-1">مبلغ هر قسط</span>
                     <span className="text-lg font-black text-gray-800">{formatCurrency(previewData.loan.installmentAmount)} {storeSettings?.currency || 'تومان'}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs text-gray-500 font-bold block mb-1">تعداد اقساط</span>
                     <span className="text-lg font-black text-gray-800">{previewData.loan.totalInstallments} قسط</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs text-gray-500 font-bold block mb-1">شخص</span>
                     <span className="text-base font-black text-gray-800">{persons.find(p => p.id === previewData.loan.personId)?.name || 'نامشخص'}</span>
                  </div>
               </div>

               <h3 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                 <List className="w-4 h-4 text-emerald-500" /> لیست اقساط
               </h3>
               
               <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-sm text-right">
                     <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                           <th className="p-3">ردیف</th>
                           <th className="p-3">سررسید</th>
                           <th className="p-3">مبلغ قسط</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {previewData.installments.map((inst, idx) => (
                           <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-3 font-bold text-gray-600">{idx + 1}</td>
                              <td className="p-3 font-mono font-medium">{formatDateDisplay(inst.dueDate.replace(/-/g, '/'))}</td>
                              <td className="p-3 font-black text-gray-900">{formatCurrency(inst.amount)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
              <button
                 onClick={() => setPrintingLoanId(previewData.loan.id)}
                 className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                 <Printer className="w-4 h-4" />
                 چاپ پیش‌نمایش
              </button>
              <div className="flex items-center gap-3">
                 <button
                    onClick={() => setPreviewData(null)}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
                 >
                    انصراف
                 </button>
                 <button
                    disabled={isSubmitting}
                    onClick={handleFinalSubmitLoan}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                 >
                    <CheckCircle className="w-5 h-5" />
                    تایید و ثبت نهایی
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {printingLoanId && (
        <InstallmentBookletPrint`;
content = content.replace(closingBraceRegex, previewModalRender);

// Add missing X import if not present
if (!content.includes(', X')) {
    content = content.replace('Printer } from \'lucide-react\';', 'Printer, X } from \'lucide-react\';');
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
