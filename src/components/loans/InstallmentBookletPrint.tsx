import React, { useRef } from 'react';
import { Loan, Installment, Person } from '../../types';
import { motion } from 'motion/react';
import { Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface InstallmentBookletPrintProps {
  loan: Loan;
  installments: Installment[];
  person: Person | undefined;
  onClose: () => void;
  formatCurrency: (val: number) => string;
}

export default function InstallmentBookletPrint({ loan, installments, person, onClose, formatCurrency }: InstallmentBookletPrintProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `دفترچه_اقساط_وام_${loan.id}`,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        dir="rtl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">چاپ دفترچه اقساط</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div ref={componentRef} className="bg-white p-8 rounded-xl print:p-0 print:bg-transparent">
            {/* Booklet Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
              <h1 className="text-2xl font-black text-slate-800 mb-2">دفترچه اقساط وام</h1>
              <div className="text-sm text-slate-500">شماره وام: {loan.id}</div>
            </div>

            {/* Loan & Person Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100 print:bg-transparent print:border-slate-300">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">وام گیرنده:</span>
                  <span className="font-bold text-slate-800">{person?.name || 'نامشخص'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">مبلغ وام:</span>
                  <span className="font-bold text-slate-800" dir="ltr">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">تاریخ پرداخت:</span>
                  <span className="font-bold text-slate-800">{loan.startDate}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">تعداد اقساط:</span>
                  <span className="font-bold text-slate-800">{loan.totalInstallments} قسط</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">مبلغ هر قسط:</span>
                  <span className="font-bold text-slate-800" dir="ltr">{formatCurrency(loan.installmentAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">تواتر پرداخت:</span>
                  <span className="font-bold text-slate-800">
                    {loan.frequency === 'monthly' ? 'ماهانه' : 
                     loan.frequency === 'quarterly' ? 'سه‌ماهه' : 
                     loan.frequency === 'yearly' ? 'سالانه' : 'سایر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Installments Table (Booklet format) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
              {installments.sort((a,b) => a.dueDate.localeCompare(b.dueDate)).map((inst, idx) => (
                <div key={inst.id} className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col relative page-break-inside-avoid">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white print:border-none">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-3 mt-2">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-sm font-semibold text-slate-600">تاریخ سررسید:</span>
                      <span className="font-black text-slate-900">{inst.dueDate}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-sm font-semibold text-slate-600">مبلغ قسط:</span>
                      <span className="font-black text-slate-900" dir="ltr">{formatCurrency(inst.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-sm font-semibold text-slate-600">تاریخ پرداخت:</span>
                      <span className="text-slate-400 text-xs">.......................................</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-semibold text-slate-600">مهر و امضا:</span>
                      <span className="text-slate-400 text-xs">.......................................</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
