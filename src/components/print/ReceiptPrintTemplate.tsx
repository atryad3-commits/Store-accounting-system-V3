import React from 'react';
import { toPersianDigits, numToPersianWords } from '../../utils/format';

export default function ReceiptPrintTemplate({ data, storeSettings, persons, getPersonDisplayName, formatCurrency }: any) {
  if (!data) return null;
  const isReceive = data.type === 'receive';
  
  let formattedDate = '';
  try {
    formattedDate = toPersianDigits(data.date ? new Date(data.date).toLocaleDateString('fa-IR') : '');
  } catch (e) {
    formattedDate = toPersianDigits(data.date ? new Date(data.date).toLocaleDateString('fa-IR') : '');
  }

  const amountStr = toPersianDigits(formatCurrency(data.amount));
  const amountWords = numToPersianWords(data.amount);
  const currency = storeSettings?.currency || 'ریال';

  return (
    <div className="w-full bg-white p-8 text-slate-800 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
        <div className="w-1/3">
          <h1 className="text-2xl font-black text-slate-900">{storeSettings?.storeName || 'نام مجموعه'}</h1>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">{storeSettings?.address}</p>
          <p className="text-slate-600 mt-1 text-sm">{storeSettings?.phone && `تلفن: ${toPersianDigits(storeSettings.phone)}`}</p>
        </div>
        
        <div className="w-1/3 text-center flex flex-col items-center justify-center">
          <div className="inline-block border-2 border-slate-800 rounded-2xl px-6 py-3">
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">
               {isReceive ? 'رسید دریافت وجه' : 'رسید پرداخت وجه'}
             </h2>
          </div>
        </div>

        <div className="w-1/3 text-left pl-2">
          <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <div className="flex justify-between gap-6 mb-2 text-sm">
              <span className="text-slate-500 font-bold">شماره رسید:</span>
              <span className="font-black text-slate-900">{toPersianDigits(data.receiptNumber || data.id)}</span>
            </div>
            <div className="flex justify-between gap-6 text-sm">
              <span className="text-slate-500 font-bold">تاریخ:</span>
              <span className="font-black text-slate-900">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="border-2 border-slate-200 rounded-2xl p-6 space-y-6 bg-slate-50/30">
        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold text-slate-600 w-32 shrink-0">{isReceive ? 'دریافت شد از :' : 'پرداخت شد به :'}</span>
          <span className="font-black text-xl border-b-2 border-dotted border-slate-300 pb-1 flex-1">
            {getPersonDisplayName(data.personId, persons)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold text-slate-600 w-32 shrink-0">مبلغ (عدد) :</span>
          <span className="font-black text-xl border-b-2 border-dotted border-slate-300 pb-1 flex-1 font-mono">
            {amountStr} <span className="text-base font-bold text-slate-500 mr-1">{currency}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold text-slate-600 w-32 shrink-0">مبلغ (حروف) :</span>
          <span className="font-black text-lg border-b-2 border-dotted border-slate-300 pb-1 flex-1">
            {amountWords} {currency}
          </span>
        </div>

        <div className="flex items-start gap-2 text-lg">
          <span className="font-bold text-slate-600 w-32 shrink-0 pt-1">بابت :</span>
          <span className="font-bold text-slate-900 border-b-2 border-dotted border-slate-300 pb-1 flex-1 min-h-[2rem] leading-relaxed">
            {data.description || '-'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold text-slate-600 w-32 shrink-0">روش پرداخت :</span>
          <span className="font-bold text-slate-900 border-b-2 border-dotted border-slate-300 pb-1 flex-1">
            {data.method === 'cash' ? 'نقدی / فیش بانکی' : data.method === 'check' ? 'چک' : data.method === 'transfer' ? 'حواله' : 'کارت خوان'}
          </span>
        </div>

        {data.method === 'check' && (
          <div className="grid grid-cols-2 gap-8 mt-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">شماره چک:</span>
              <span className="font-black text-lg">{toPersianDigits(data.checkNumber)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">تاریخ سررسید:</span>
              <span className="font-black text-lg">{toPersianDigits(data.checkDueDate)}</span>
            </div>
            {isReceive && data.checkBankName && (
              <div className="flex items-center gap-2 col-span-2">
                <span className="text-slate-500 font-bold">نام بانک:</span>
                <span className="font-black text-lg">{data.checkBankName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signatures */}
      <div className="mt-20 grid grid-cols-2 gap-8 px-12 text-center">
        <div>
          <div className="text-lg font-bold text-slate-600 mb-16">{isReceive ? 'مهر و امضا دریافت کننده' : 'مهر و امضا پرداخت کننده'}</div>
          <div className="border-t-2 border-slate-300 mx-8"></div>
        </div>
        <div>
          <div className="text-lg font-bold text-slate-600 mb-16">{isReceive ? 'مهر و امضا پرداخت کننده' : 'مهر و امضا دریافت کننده'}</div>
          <div className="border-t-2 border-slate-300 mx-8"></div>
        </div>
      </div>
      
      {/* Footer / Notes */}
      <div className="mt-12 pt-4 border-t border-slate-200 text-center text-sm text-slate-400 font-medium print:block">
        چاپ شده توسط سیستم مدیریت مالی
      </div>
    </div>
  );
}
