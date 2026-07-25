import React, { useState } from "react";
import { X, Printer, CheckCircle, Eye, Wallet, Settings } from "lucide-react";
import InvoicePrintTemplate from "../print/InvoicePrintTemplate";
import WarehousePrintTemplate from "../print/WarehousePrintTemplate";

export default function PreviewModals(props: any) {
  const {
    viewingInvoice, setViewingInvoice,
    previewInvoiceData, setPreviewInvoiceData,
    submitting, saveInvoiceData,
    viewingCheck, setViewingCheck, getPersonDisplayName, persons, formatCurrency, toPersianDigits,
    previewReceiptData, setPreviewReceiptData, confirmReceiptSubmit,
    storeSettings, products, warehouses,
    transactions, invoices, personOpeningBalances, issuedChecks, receivedChecks
  } = props;

  const [printSettings, setPrintSettings] = useState({
    showStoreLogo: true,
    showSignatures: true,
    showTransactions: true,
    showBalance: true,
    showNotes: true,
    showFooter: true,
    designType: 'classic' // classic or modern
  });

  return (
    <>
      {/* Invoice Preview / Viewing */}
      {(viewingInvoice || previewInvoiceData) && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-slate-900/50 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none" dir="rtl">
          <div className="flex-1 w-full max-w-5xl mx-auto my-0 sm:my-4 bg-slate-100 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden print:w-full print:max-w-none print:m-0 print:rounded-none print:shadow-none print:bg-white relative">
            <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between print:hidden shrink-0 z-10">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-slate-800">
                  {viewingInvoice ? "پیش‌نمایش چاپ" : "تایید نهایی و چاپ سند"}
                </h3>
                <div className="hidden sm:flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Settings className="w-3.5 h-3.5" />
                    <span>تنظیمات چاپ:</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={printSettings.showStoreLogo} onChange={(e) => setPrintSettings(s => ({...s, showStoreLogo: e.target.checked}))} className="rounded text-indigo-600" />
                    <span>لوگو</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={printSettings.showSignatures} onChange={(e) => setPrintSettings(s => ({...s, showSignatures: e.target.checked}))} className="rounded text-indigo-600" />
                    <span>امضاها</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={printSettings.showTransactions} onChange={(e) => setPrintSettings(s => ({...s, showTransactions: e.target.checked}))} className="rounded text-indigo-600" />
                    <span>تراکنش‌ها</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" checked={printSettings.showBalance} onChange={(e) => setPrintSettings(s => ({...s, showBalance: e.target.checked}))} className="rounded text-indigo-600" />
                    <span>مانده</span>
                  </label>
                  <select 
                    value={printSettings.designType}
                    onChange={(e) => setPrintSettings(s => ({...s, designType: e.target.value}))}
                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
                  >
                    <option value="classic">کلاسیک</option>
                    <option value="modern">مدرن</option>
                  </select>
                </div>
              </div>
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
            
            {/* Mobile Print Settings */}
            <div className="sm:hidden bg-slate-50 border-b border-slate-200 p-3 shrink-0 print:hidden overflow-x-auto flex items-center gap-4 whitespace-nowrap">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={printSettings.showStoreLogo} onChange={(e) => setPrintSettings(s => ({...s, showStoreLogo: e.target.checked}))} className="rounded text-indigo-600" />
                <span>لوگو</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={printSettings.showSignatures} onChange={(e) => setPrintSettings(s => ({...s, showSignatures: e.target.checked}))} className="rounded text-indigo-600" />
                <span>امضاها</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={printSettings.showTransactions} onChange={(e) => setPrintSettings(s => ({...s, showTransactions: e.target.checked}))} className="rounded text-indigo-600" />
                <span>تراکنش‌ها</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={printSettings.showBalance} onChange={(e) => setPrintSettings(s => ({...s, showBalance: e.target.checked}))} className="rounded text-indigo-600" />
                <span>مانده</span>
              </label>
              <select 
                value={printSettings.designType}
                onChange={(e) => setPrintSettings(s => ({...s, designType: e.target.value}))}
                className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
              >
                <option value="classic">کلاسیک</option>
                <option value="modern">مدرن</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 print:p-0 print:overflow-visible">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none overflow-hidden mx-auto max-w-[210mm] min-h-[297mm] print:w-full print:max-w-none print:min-h-0">
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
                    transactions={transactions}
                    invoices={invoices}
                    personOpeningBalances={personOpeningBalances}
                    issuedChecks={issuedChecks}
                    receivedChecks={receivedChecks}
                    printSettings={printSettings}
                  />
                )}
              </div>
            </div>
            
            {previewInvoiceData && (
              <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 print:hidden shrink-0">
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
               <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 print:hidden shrink-0">
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden" dir="rtl">
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden" dir="rtl">
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
