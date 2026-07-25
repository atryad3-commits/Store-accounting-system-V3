const fs = require('fs');
const file = 'src/components/financial/ReceiptsList.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldButtons = `<div className="flex gap-2">
              <button
                onClick={() => setActiveTab?.("create_receive_receipt")}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                دریافت
              </button>
              <button
                onClick={() => setActiveTab?.("create_pay_receipt")}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                پرداخت
              </button>
            </div>`;

const newButtons = `<div className="flex gap-2">
              {targetType === "receive" && (
              <button
                onClick={() => setActiveTab?.("create_receive_receipt")}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                ثبت دریافت جدید
              </button>
              )}
              {targetType === "pay" && (
              <button
                onClick={() => setActiveTab?.("create_pay_receipt")}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                ثبت پرداخت جدید
              </button>
              )}
            </div>`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync(file, content);
