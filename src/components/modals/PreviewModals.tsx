import React from 'react';
import { Eye, X, CheckCircle, Printer, Calendar, Wallet } from 'lucide-react';
import InvoicePrintTemplate from '../print/InvoicePrintTemplate';
import WarehousePrintTemplate from '../print/WarehousePrintTemplate';

export default function PreviewModals({
  viewingInvoice, setViewingInvoice,
  previewInvoiceData, setPreviewInvoiceData,
  viewingCheck, setViewingCheck,
  viewingPayslip, setViewingPayslip,
  previewReceiptData, setPreviewReceiptData,
  saveInvoiceData, confirmReceiptSubmit, submitting,
  storeSettings, persons, products, warehouses,
  formatCurrency, formatDateDisplay, toPersianDigits, numToPersianWords, getPersonDisplayName, getRoleName
}: any) {
  return (
    <>
      {/* Invoice Preview / Viewing */}
      {(viewingInvoice || previewInvoiceData) && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" />
                {previewInvoiceData ? "پیش‌نمایش سند قبل از ثبت" : "مشاهده سند"}
              </h3>
              <button
                onClick={() => {
                  setViewingInvoice(null);
                  setPreviewInvoiceData(null);
                }}
                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {(viewingInvoice?.type?.includes("warehouse") || previewInvoiceData?.type?.includes("warehouse")) ? (
                  <WarehousePrintTemplate
                    data={viewingInvoice || previewInvoiceData}
                    storeSettings={storeSettings}
                    persons={persons}
                    products={products}
                    warehouses={warehouses}
                  />
                ) : (
                  <InvoicePrintTemplate
                    data={viewingInvoice || previewInvoiceData}
                    storeSettings={storeSettings}
                    persons={persons}
                  />
                )}
              </div>
            </div>
            
            {previewInvoiceData && (
              <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewInvoiceData(null)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                >
                  انصراف و ویرایش
                </button>
                <button
                  onClick={() => {
                    saveInvoiceData(previewInvoiceData);
                    setPreviewInvoiceData(null);
                  }}
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  تایید و ثبت نهایی
                </button>
              </div>
            )}
            {viewingInvoice && (
               <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                 <button onClick={() => window.print()} className="px-6 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">
                   <Printer className="w-5 h-5" />
                   چاپ
                 </button>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Check Preview */}
      {viewingCheck && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button onClick={() => setViewingCheck(null)} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-indigo-500" />
                مشاهده اطلاعات چک
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">شماره چک</span>
                  <span className="font-black text-slate-800">{toPersianDigits(viewingCheck.checkNumber)}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">مبلغ چک</span>
                  <span className="font-black text-slate-800">{toPersianDigits(formatCurrency(viewingCheck.amount))} ریال</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">تاریخ سررسید</span>
                  <span className="font-black text-slate-800">{viewingCheck.dueDate}</span>
                </div>
                {viewingCheck.bankName && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-sm font-bold">نام بانک</span>
                    <span className="font-black text-slate-800">{viewingCheck.bankName}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">شخص مرتبط</span>
                  <span className="font-black text-slate-800">{getPersonDisplayName(viewingCheck.personId, persons)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview */}
      {previewReceiptData && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button onClick={() => setPreviewReceiptData(null)} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-emerald-500" />
                تایید رسید {previewReceiptData.type === 'receive' ? 'دریافت' : 'پرداخت'}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">شخص</span>
                  <span className="font-black text-slate-800">{getPersonDisplayName(previewReceiptData.personId, persons)}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">مبلغ تراکنش</span>
                  <span className="font-black text-emerald-600">{toPersianDigits(formatCurrency(previewReceiptData.amount))} ریال</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">تاریخ</span>
                  <span className="font-black text-slate-800">{previewReceiptData.date}</span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setPreviewReceiptData(null)}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    confirmReceiptSubmit(previewReceiptData);
                    setPreviewReceiptData(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  تایید نهایی
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
