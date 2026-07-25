import React from "react";
import { formatDateDisplay, toPersianDigits, addCommas } from "../../utils/format";
import { Building2, Store } from "lucide-react";

interface InvoicePrintTemplateProps {
  data: any;
  storeSettings: any;
  persons: any[];
  transactions?: any[];
  invoices?: any[];
  personOpeningBalances?: any[];
  issuedChecks?: any[];
  receivedChecks?: any[];
  printSettings?: any;
}

export default function InvoicePrintTemplate({
  data,
  storeSettings,
  persons,
  transactions = [],
  invoices = [],
  personOpeningBalances = [],
  issuedChecks = [],
  receivedChecks = [],
  printSettings = {
    showStoreLogo: true,
    showSignatures: true,
    showTransactions: true,
    showBalance: true,
    showNotes: true,
    designType: 'classic'
  }
}: InvoicePrintTemplateProps) {
  const isSale = data.type === "sale" || data.type === "sale_return";
  const isReturn = data.type === "sale_return" || data.type === "purchase_return";
  
  const title = isSale
    ? isReturn ? "فاکتور برگشت از فروش" : "صورتحساب فروش کالا و خدمات"
    : isReturn ? "فاکتور برگشت از خرید" : "فاکتور خرید";
      
  const relatedPerson = persons.find(
    (p) => p.id === data.customerId
  );

  const allocatedTransactions = (transactions || []).filter((t: any) => {
    return t.linkedInvoices && t.linkedInvoices[data.id] && t.linkedInvoices[data.id] > 0;
  });

  const totalAllocated = allocatedTransactions.reduce((sum: number, t: any) => sum + (t.linkedInvoices[data.id] || 0), 0);
  const remainingInvoiceBalance = (data.totalAmount || 0) - totalAllocated;

  // Calculate person balance up to this invoice date
  let personBalance = 0;
  if (relatedPerson) {
    const personIdStr = relatedPerson.id.toString();
    const invoiceDateStr = data.date || data.createdAt || new Date().toISOString();
        
    // 1. Initial Balance
    if (relatedPerson.initialBalance && relatedPerson.initialBalanceType !== "settled") {
      personBalance += relatedPerson.initialBalanceType === "debtor" 
        ? relatedPerson.initialBalance 
        : -relatedPerson.initialBalance;
    }
        
    const ob = personOpeningBalances.find(b => b.personId?.toString() === personIdStr);
    if (ob && ob.amount && ob.type !== "settled") {
      personBalance = ob.type === "debtor" ? ob.amount : -ob.amount;
    }

    (invoices || []).filter(i => 
      i.customerId?.toString() === personIdStr && 
      !i.isDraft && i.status !== "draft" &&
      i.type !== "warehouse_receipt" && i.type !== "warehouse_remittance" && i.type !== "proforma" &&
      ((i.date || i.createdAt || "") <= invoiceDateStr || i.id === data.id)
    ).forEach(inv => {
      const amount = inv.totalAmount || 0;
      if (inv.type === "sale") personBalance += amount;
      else if (inv.type === "purchase") personBalance -= amount;
      else if (inv.type === "sale_return") personBalance -= amount;
      else if (inv.type === "purchase_return") personBalance += amount;
    });

    (transactions || []).filter(t => 
      t.personId?.toString() === personIdStr && t.method !== "check" &&
      (t.date || t.createdAt || "") <= invoiceDateStr
    ).forEach(t => {
      if (t.type === "receive") personBalance -= t.amount || 0;
      else if (t.type === "pay") personBalance += t.amount || 0;
      else if (t.type === "salary") personBalance -= t.amount || 0;
    });

    (issuedChecks || []).filter(c => 
      c.payeeId?.toString() === personIdStr &&
      c.status !== "cancelled" && c.status !== "bounced" && c.status !== "cashed" &&
      (c.date || c.createdAt || "") <= invoiceDateStr
    ).forEach(c => {
      personBalance += c.amount || 0;
    });

    (receivedChecks || []).filter(c => 
      c.payerId?.toString() === personIdStr &&
      c.status !== "returned" && c.status !== "bounced" && c.status !== "cashed" &&
      (c.date || c.createdAt || "") <= invoiceDateStr
    ).forEach(c => {
      personBalance -= c.amount || 0;
    });
  }

  const balanceType = personBalance > 0 ? "بدهکار" : personBalance < 0 ? "بستانکار" : "بی‌حساب";
  const absBalance = Math.abs(personBalance);

  const sumTotal = data.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0) || 0;
  const totalDiscount = sumTotal - (data.totalAmount || 0);

  // Layout Styles
  const isClassic = printSettings.designType === 'classic';

  return (
    <div className={`p-8 bg-white min-h-[297mm] text-slate-800 ${isClassic ? 'font-serif' : 'font-sans'}`} dir="rtl">
      {/* Header */}
      <div className={`flex justify-between items-start mb-6 pb-4 ${isClassic ? 'border-b-2 border-slate-800' : 'border-b border-slate-200'}`}>
        <div className="flex-1">
          {printSettings.showStoreLogo && (
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 flex items-center justify-center bg-slate-100 ${isClassic ? 'rounded-none border border-slate-800' : 'rounded-xl'}`}>
                <Store className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-black">{storeSettings.storeName || "نام فروشگاه"}</h1>
                {(storeSettings.phone || storeSettings.mobile) && (
                  <div className="text-sm mt-1 font-bold text-slate-600">
                    تلفن: {toPersianDigits(storeSettings.phone || storeSettings.mobile)}
                  </div>
                )}
              </div>
            </div>
          )}
          {!printSettings.showStoreLogo && (
            <h1 className="text-2xl font-black mb-2">{storeSettings.storeName || "نام فروشگاه"}</h1>
          )}
          <div className="text-sm font-bold text-slate-600 max-w-sm leading-relaxed mt-2">
            آدرس: {storeSettings.address || "آدرس فروشگاه ثبت نشده است"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-4 flex-1">
          <h2 className="text-2xl font-black mb-2 px-6 py-2 border-2 border-slate-800 rounded-lg shadow-[4px_4px_0_0_#1e293b]">{title}</h2>
        </div>

        <div className={`flex-1 text-left ${isClassic ? 'text-sm font-bold' : 'text-xs'}`}>
          <div className="mb-2 text-base">
            شماره فاکتور: <span className="font-black text-lg text-slate-900">{toPersianDigits(data.invoiceNumber)}</span>
          </div>
          <div className="mb-2 text-slate-600">
            تاریخ: <span className="font-bold text-slate-900">{formatDateDisplay(data.date || data.createdAt)}</span>
          </div>
          {data.note && printSettings.showNotes && (
            <div className="mb-2 text-slate-600">
              پیگیری: <span className="font-bold text-slate-900">{toPersianDigits(data.note)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Info (Classic Table Style) */}
      <div className={`mb-6 rounded-lg overflow-hidden ${isClassic ? 'border-2 border-slate-800' : 'border border-slate-200 bg-slate-50'}`}>
        <div className={`px-4 py-2 text-sm font-black ${isClassic ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
          مشخصات خریدار / مشتری
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-3 p-4 gap-4 text-sm font-bold ${isClassic ? 'bg-white' : ''}`}>
          <div>
            نام شخص: <span className="text-slate-900 text-base">{relatedPerson?.name || "مشتری عمومی"}</span>
          </div>
          <div>
            شماره تماس: <span className="text-slate-900">{toPersianDigits(relatedPerson?.mobile || relatedPerson?.phone || "-")}</span>
          </div>
          {printSettings.showBalance && relatedPerson && (
             <div>
               وضعیت حساب (تا این فاکتور): <span className="text-slate-900" dir="rtl">{toPersianDigits(addCommas(absBalance))} {storeSettings.currency} ({balanceType})</span>
             </div>
          )}
          <div className="sm:col-span-3">
            آدرس: <span className="text-slate-900">{relatedPerson?.address || "-"}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className={`mb-6 rounded-lg overflow-hidden ${isClassic ? 'border-2 border-slate-800' : 'border border-slate-200 shadow-sm'}`}>
        <table className="w-full text-sm">
          <thead className={`${isClassic ? 'bg-slate-200 border-b-2 border-slate-800' : 'bg-slate-100 border-b border-slate-200'}`}>
            <tr>
              <th className={`py-3 px-2 text-center w-12 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>ردیف</th>
              <th className={`py-3 px-4 text-right font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>شرح کالا یا خدمات</th>
              <th className={`py-3 px-2 text-center w-20 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>تعداد/مقدار</th>
              <th className={`py-3 px-2 text-center w-20 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>واحد</th>
              <th className={`py-3 px-4 text-center w-32 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>فی ({storeSettings.currency})</th>
              <th className={`py-3 px-2 text-center w-24 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>تخفیف</th>
              <th className={`py-3 px-4 text-center w-36 font-black`}>مبلغ کل ({storeSettings.currency})</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isClassic ? 'divide-slate-800' : 'divide-slate-200'}`}>
            {data.items?.map((item: any, idx: number) => (
              <tr key={idx} className={idx % 2 !== 0 && !isClassic ? 'bg-slate-50' : ''}>
                <td className={`py-3 px-2 text-center font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{toPersianDigits(idx + 1)}</td>
                <td className={`py-3 px-4 font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{item.productName || "کالا"}</td>
                <td className={`py-3 px-2 text-center font-bold text-base ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{toPersianDigits(item.quantity || 1)}</td>
                <td className={`py-3 px-2 text-center text-slate-600 ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{item.selectedUnit || "-"}</td>
                <td className={`py-3 px-4 text-center font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{toPersianDigits(addCommas(item.unitPrice || 0))}</td>
                <td className={`py-3 px-2 text-center font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{toPersianDigits(addCommas(item.discountPercent || 0))}</td>
                <td className={`py-3 px-4 text-center font-black text-base`}>{toPersianDigits(addCommas(item.totalPrice || 0))}</td>
              </tr>
            ))}
            {/* Empty rows if items are few to maintain classic look */}
            {isClassic && Array.from({ length: Math.max(0, 5 - (data.items?.length || 0)) }).map((_, i) => (
               <tr key={`empty-${i}`} className="h-12">
                  <td className="border-l-2 border-slate-800"></td>
                  <td className="border-l-2 border-slate-800"></td>
                  <td className="border-l-2 border-slate-800"></td>
                  <td className="border-l-2 border-slate-800"></td>
                  <td className="border-l-2 border-slate-800"></td>
                  <td className="border-l-2 border-slate-800"></td>
                  <td></td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Area */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="flex-1 space-y-4">
           {printSettings.showNotes && data.description && (
             <div className={`p-4 rounded-lg min-h-[100px] ${isClassic ? 'border-2 border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                <div className="font-black text-sm mb-2">توضیحات فاکتور:</div>
                <div className="text-sm font-bold leading-loose text-slate-700">{data.description}</div>
             </div>
           )}
           <div className={`p-4 rounded-lg font-bold text-sm ${isClassic ? 'border-2 border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
              نحوه تسویه: <span className="text-slate-900">{data.paymentMethod === "cash" ? "نقدی" : data.paymentMethod === "credit" ? "نسیه" : "ترکیبی"}</span>
           </div>
        </div>

        <div className={`w-80 shrink-0 rounded-lg overflow-hidden ${isClassic ? 'border-2 border-slate-800' : 'border border-slate-200'}`}>
          <div className={`flex justify-between p-3 ${isClassic ? 'border-b-2 border-slate-800' : 'border-b border-slate-200'}`}>
             <span className="font-bold text-slate-600">جمع مبلغ کالاها:</span>
             <span className="font-black text-base">{toPersianDigits(addCommas(sumTotal))}</span>
          </div>
          {totalDiscount > 0 && (
            <div className={`flex justify-between p-3 text-red-600 ${isClassic ? 'border-b-2 border-slate-800' : 'border-b border-slate-200'}`}>
               <span className="font-bold">تخفیف کل:</span>
               <span className="font-black text-base">{toPersianDigits(addCommas(totalDiscount))}</span>
            </div>
          )}
          <div className={`flex justify-between p-4 bg-slate-800 text-white text-lg font-black ${isClassic ? '' : 'rounded-b-lg'}`}>
             <span>مبلغ قابل پرداخت:</span>
             <span>{toPersianDigits(addCommas(data.totalAmount || 0))} <span className="text-sm font-normal">{storeSettings.currency}</span></span>
          </div>
        </div>
      </div>

      {/* Allocated Transactions Area */}
      {printSettings.showTransactions && allocatedTransactions.length > 0 && (
        <div className={`mb-8 rounded-lg overflow-hidden ${isClassic ? 'border-2 border-slate-800' : 'border border-slate-200'}`}>
          <div className={`px-4 py-2 text-sm font-black ${isClassic ? 'bg-slate-200 border-b-2 border-slate-800' : 'bg-slate-100 border-b border-slate-200'}`}>
            تراکنش‌های مالی مرتبط
          </div>
          <table className="w-full text-right text-sm">
            <thead className={`${isClassic ? 'border-b-2 border-slate-800 bg-slate-50' : 'border-b border-slate-200 bg-slate-50'}`}>
              <tr>
                <th className={`py-2 px-4 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>تاریخ</th>
                <th className={`py-2 px-4 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>نوع</th>
                <th className={`py-2 px-4 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>روش</th>
                <th className={`py-2 px-4 font-black ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>شماره/پیگیری</th>
                <th className={`py-2 px-4 font-black`}>مبلغ اختصاص یافته ({storeSettings.currency})</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isClassic ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {allocatedTransactions.map((tx: any, idx: number) => {
                const txType = tx.type === "receive" ? "دریافت" : "پرداخت";
                const txMethod = tx.method === "cash" ? "نقدی" : "چک";
                const txRef = tx.method === "check" ? tx.checkNumber : tx.receiptNumber || "-";
                const allocatedAmount = tx.linkedInvoices[data.id];
                return (
                  <tr key={idx}>
                    <td className={`py-2 px-4 font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{formatDateDisplay(tx.jalaliDate || tx.date)}</td>
                    <td className={`py-2 px-4 font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{txType}</td>
                    <td className={`py-2 px-4 font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{txMethod}</td>
                    <td className={`py-2 px-4 font-bold ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>{toPersianDigits(txRef)}</td>
                    <td className={`py-2 px-4 font-black text-base`}>{toPersianDigits(addCommas(allocatedAmount))}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className={`${isClassic ? 'border-t-2 border-slate-800 bg-slate-100' : 'border-t border-slate-200 bg-slate-50'}`}>
              <tr>
                <td colSpan={4} className={`py-3 px-4 text-left font-black text-emerald-700 ${isClassic ? 'border-l-2 border-slate-800' : 'border-l border-slate-200'}`}>جمع مبالغ تسویه شده</td>
                <td className="py-3 px-4 font-black text-lg text-emerald-700">{toPersianDigits(addCommas(totalAllocated))}</td>
              </tr>
              {remainingInvoiceBalance > 0 && (
                 <tr>
                   <td colSpan={4} className={`py-3 px-4 text-left font-black text-rose-700 ${isClassic ? 'border-l-2 border-slate-800 border-t-2' : 'border-l border-slate-200 border-t'}`}>مانده فاکتور</td>
                   <td className={`py-3 px-4 font-black text-lg text-rose-700 ${isClassic ? 'border-t-2 border-slate-800' : 'border-t border-slate-200'}`}>{toPersianDigits(addCommas(remainingInvoiceBalance))}</td>
                 </tr>
              )}
            </tfoot>
          </table>
        </div>
      )}

      {/* Signatures */}
      {printSettings.showSignatures && (
        <div className="mt-12 mb-8 grid grid-cols-2 gap-12 text-center text-sm font-black text-slate-800">
          <div className="flex flex-col items-center">
            <span>مهر و امضای فروشنده</span>
            <div className="w-2/3 border-b-2 border-dashed border-slate-400 mt-16"></div>
          </div>
          <div className="flex flex-col items-center">
            <span>مهر و امضای خریدار</span>
            <div className="w-2/3 border-b-2 border-dashed border-slate-400 mt-16"></div>
          </div>
        </div>
      )}
            
      {/* Footer Note */}
      {storeSettings.print_footer_note && (
        <div className={`mt-auto pt-4 text-center text-sm font-bold text-slate-600 ${isClassic ? 'border-t-2 border-slate-800' : 'border-t border-slate-200'}`}>
           {storeSettings.print_footer_note}
        </div>
      )}
    </div>
  );
}
