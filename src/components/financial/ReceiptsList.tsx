import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import * as lucide from 'lucide-react';
const { Search, Plus, Filter, FileText, Download, CheckCircle, Edit2, Trash2, Printer, Check, X, ArrowUpRight, ArrowDownRight, ArrowRight, CornerDownLeft, Package, User, Clock, CheckCircle2, ChevronLeft, ChevronRight, Share2, Eye, Truck, MoreVertical, DollarSign, RefreshCw, XCircle } = lucide as any;

export default function ReceiptsList(props: any) {
  const {
    transactions, activeTab, persons, getPersonDisplayName, formatCurrency, formatDateDisplay, setViewingTransaction,
    renderPersonLink, storeSettings, List, setActiveTab, invoiceSearchQuery, setInvoiceSearchQuery, toPersianDigits, accounts, cashboxes, formatNumber, numToPersianWords, openPayslip, setPrintingTransaction, setEditingReceipt, setIsEditReceiptModalOpen, confirmAction, deleteTransaction, fetchTransactions,
    ...rest
  } = props;

      
        const isReceive = activeTab === "list_receive_receipt";
        const filteredTxs = transactions.filter(
          (t) => t.type === (isReceive ? "receive" : "pay"),
        );

        const themeText = isReceive ? "text-emerald-700" : "text-rose-700";
        const themeBg = isReceive ? "bg-emerald-50" : "bg-rose-50";
        const themeBorder = isReceive
          ? "border-emerald-200"
          : "border-rose-200";
        const themeIcon = isReceive ? "text-emerald-600" : "text-rose-600";
        const themeNum = isReceive ? "text-emerald-900" : "text-rose-900";
        const themeHighlightTxt = isReceive
          ? "text-emerald-600"
          : "text-rose-600";
        const themeRowHover = isReceive
          ? "hover:bg-emerald-50/50"
          : "hover:bg-rose-50/50";

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-right"
          >
            <div
              className={`bg-white rounded-2xl p-6 shadow-sm border ${themeBorder} ${themeBg} bg-opacity-40 flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <List className={`w-6 h-6 ${themeIcon}`} />
                    {isReceive
                      ? "لیست رسیدهای دریافت وجه رسمی"
                      : "لیست رسیدهای پرداخت وجه رسمی"}
                  </h2>
                  <button
                     onClick={() => setActiveTab(isReceive ? "receive_receipt" : "pay_receipt")}
                     className={`px-4 py-2 ${isReceive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"} text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm`}
                  >
                     <Plus className="w-4 h-4" /> 
                     {isReceive ? "ثبت رسید دریافت جدید" : "ثبت رسید پرداخت جدید"}
                  </button>
              </div>
              <div className="relative w-full md:w-96">
                <Search
                  className={`w-5 h-5 ${themeIcon} opacity-50 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2`}
                />
                <input
                  type="text"
                  placeholder="جستجوی حرفه‌ای (شماره رسید، نام شخص)..."
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-2 outline-none transition-all placeholder-slate-400 font-bold ${isReceive ? "focus:ring-emerald-500/50" : "focus:ring-rose-500/50"}`}
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50 text-sm text-slate-500 border-b border-slate-200 text-right">
                      <th className="p-4 font-black">شناسه سند</th>
                      <th className="p-4 font-black">طرف حساب</th>
                      <th className="p-4 font-black">تاریخ سند</th>
                      <th className="p-4 font-black">منبع مالی</th>
                      <th className="p-4 font-black">مبلغ تراکنش</th>
                      <th className="p-4 font-black text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTxs
                      .filter((tx) => {
                        if (!invoiceSearchQuery) return true;
                        const term = invoiceSearchQuery.toLowerCase();
                        const personName = (
                          persons.find(
                            (p) => p.id.toString() === tx.personId?.toString(),
                          )?.name || "نامشخص"
                        ).toLowerCase();
                        const receiptNum = (
                          tx.receiptNumber || `#${tx.id}`
                        ).toLowerCase();
                        return (
                          personName.includes(term) || receiptNum.includes(term)
                        );
                      })
                      .map((tx) => {
                        const person = persons.find(
                          (p) => p.id.toString() === tx.personId?.toString(),
                        );
                        const resourceLabel =
                          tx.method === "check"
                            ? `چک (${toPersianDigits(tx.checkNumber || "")})`
                            : tx.resourceType === "bank"
                              ? `حساب بانکی: ${accounts.find((a) => a.id.toString() === tx.resourceId?.toString())?.bankName || "نامشخص"}`
                              : `صندوق: ${cashboxes.find((cb) => cb.id.toString() === tx.resourceId?.toString())?.name || "نامشخص"}`;
                        return (
                          <tr
                            key={tx.id}
                            className={`${themeRowHover} transition-colors`}
                          >
                            <td
                              className={`p-4 font-sans font-bold text-sm ${themeHighlightTxt}`}
                            >
                              {toPersianDigits(tx.receiptNumber) ||
                                `#${toPersianDigits(tx.id)}`}
                            </td>
                            <td className="p-4 font-bold text-slate-800">
                              {renderPersonLink(person?.id, person?.name)}
                            </td>
                            <td className="p-4 font-sans text-slate-600 font-bold text-xs">
                              {formatDateDisplay(
                                tx.date || tx.jalaliDate,
                              )}
                            </td>
                            <td className="p-4 text-xs font-black text-slate-600 text-right">
                              <div>{resourceLabel}</div>
                              {tx.note && <div className="text-[10px] text-gray-500 mt-1 font-normal opacity-80">{tx.note}</div>}
                            </td>
                            <td className="p-4 text-right">
                              <div
                                className={`font-sans font-black ${themeNum} text-sm`}
                              >
                                {toPersianDigits(formatNumber(tx.amount))}{" "}
                                {storeSettings.currency}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold mt-0.5 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {numToPersianWords(tx.amount)}{" "}
                                {storeSettings.currency}
                              </div>
                            </td>
                            <td className="p-4 text-center flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (tx.type === "salary") openPayslip(tx);
                                  else setPrintingTransaction(tx);
                                }}
                                className={`px-3 py-2 ${isReceive ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" : "bg-rose-50 hover:bg-rose-100 text-rose-700"} rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer border-none transition-colors`}
                              >
                                <Printer className="w-3.5 h-3.5" />
                                پیش‌نمایش و چاپ رسید
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingReceipt(tx);
                                  setIsEditReceiptModalOpen(true);
                                }}
                                className={`p-2 text-slate-400 ${isReceive ? "hover:bg-emerald-50 hover:text-emerald-600" : "hover:bg-rose-50 hover:text-rose-600"} rounded-lg cursor-pointer border-none bg-transparent transition-colors`}
                                title="ویرایش رسید"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  confirmAction(
                                    "حذف این مورد غیرقابل بازگشت است.",
                                    () =>
                                      deleteTransaction(tx.id.toString()).then(
                                        fetchTransactions,
                                      ),
                                  )
                                }
                                className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg cursor-pointer border-none bg-transparent transition-colors"
                                title="حذف سند"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {filteredTxs.filter((tx) => {
                      if (!invoiceSearchQuery) return true;
                      const term = invoiceSearchQuery.toLowerCase();
                      const personName = (
                        persons.find(
                          (p) => p.id.toString() === tx.personId?.toString(),
                        )?.name || "نامشخص"
                      ).toLowerCase();
                      const receiptNum = (
                        tx.receiptNumber || `#${tx.id}`
                      ).toLowerCase();
                      return (
                        personName.includes(term) || receiptNum.includes(term)
                      );
                    }).length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-400 font-bold"
                        >
                          هیچ سند یا رسیدی در این بخش یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );
}
