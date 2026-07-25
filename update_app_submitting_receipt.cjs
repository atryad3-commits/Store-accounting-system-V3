const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const loader = `
          {submittingReceipt && !previewReceiptData && (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-8 text-center cursor-wait select-none" dir="rtl">
              <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-black text-white mb-2">در حال ثبت تراکنش مالی...</h3>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6 font-bold">
                لطفاً منتظر بمانید. سیستم در حال بررسی، تایید و ثبت نهایی اسناد و بروزرسانی حساب‌های مرتبط به صورت یکپارچه می‌باشد.
              </p>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute h-full w-1/2 bg-emerald-500 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          )}
`;

content = content.replace(
  '          {isPersonModalOpen && (',
  loader + '\n          {isPersonModalOpen && ('
);

fs.writeFileSync(file, content);
