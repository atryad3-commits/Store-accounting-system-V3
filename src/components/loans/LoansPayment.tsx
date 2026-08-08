import React, { useState, useRef } from 'react';
import { Search, CheckCircle, Printer, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Loan, Installment } from '../../types';
import { useReactToPrint } from 'react-to-print';

interface Props {
  addTransaction?: (tx: any) => Promise<any>;
  storeSettings?: any;
  loans: Loan[];
  installments: Installment[];
  persons: any[];
  formatCurrency: (val: number) => string;
  setInstallments: (insts: Installment[]) => void;
  showNotification: (msg: string, type: 'success'|'error') => void;
  saveInstallments: (insts: Installment[]) => Promise<void>;
  addSystemLog: (action: string, details: string, entity: string, id: string | number) => Promise<void>;
}

export default function LoansPayment({ loans, installments, persons, formatCurrency, setInstallments, showNotification, saveInstallments, addSystemLog, addTransaction, storeSettings }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const getPersonName = (id: string | number) => {
    const p = persons.find(p => p.id === id);
    return p ? (p.firstName + ' ' + p.lastName).trim() : 'نامشخص';
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    const term = searchQuery.toLowerCase();
    
    // Find loan by exact loanNumber or matching person
    const matchedLoans = loans.filter(l => 
      (l.loanNumber && l.loanNumber.includes(term)) || 
      l.id.toString().includes(term) ||
      getPersonName(l.personId).toLowerCase().includes(term)
    );
    
    if (matchedLoans.length === 1) {
      setSelectedLoan(matchedLoans[0]);
    } else if (matchedLoans.length > 1) {
      // Just pick first for simplicity or show list
      setSelectedLoan(matchedLoans[0]);
      showNotification(`چندین وام پیدا شد، اولین مورد نمایش داده می‌شود.`, 'success');
    } else {
      setSelectedLoan(null);
      showNotification('وامی یافت نشد.', 'error');
    }
  };

  const loanInstallments = selectedLoan ? installments.filter(i => i.loanId === selectedLoan.id).sort((a,b) => (a.installmentNumber || 0) - (b.installmentNumber || 0)) : [];
  
    const handlePay = async (inst: Installment) => {
    try {
      const updatedInsts = installments.map(i => {
        if (i.id === inst.id) {
          return { ...i, status: 'paid', paidDate: new Date().toLocaleDateString('fa-IR').replace(/\//g, '-'), paidAmount: i.amount } as Installment;
        }
        return i;
      });
      setInstallments(updatedInsts);
      await saveInstallments(updatedInsts);
      await addSystemLog('PAY_INSTALLMENT', `پرداخت قسط ${inst.installmentNumber || ''} وام ${selectedLoan?.loanNumber || selectedLoan?.id}`, 'Installment', inst.id);
      
      if (addTransaction && selectedLoan) {
        const txType = selectedLoan.type === 'given' ? 'receive' : 'pay';
        await addTransaction({
          type: txType,
          amount: inst.amount,
          accountId: selectedLoan.accountId || '',
          personId: selectedLoan.personId,
          categoryId: selectedLoan.type === 'given' ? 'loan_installment_receive' : 'loan_installment_pay',
          description: `دریافت قسط ${inst.installmentNumber || ''} وام ${selectedLoan.loanNumber || selectedLoan.id}`,
          date: new Date().toLocaleDateString('fa-IR').replace(/\//g, '-'),
          time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
          isSystem: true,
        });
      }

      showNotification('قسط با موفقیت پرداخت شد.', 'success');
    } catch(err) {
      showNotification('خطا در پرداخت قسط', 'error');
    }
  };

  const bookletRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: bookletRef,
    documentTitle: `دفترچه_اقساط_وام_${selectedLoan?.loanNumber || selectedLoan?.id}`,
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="شماره وام یا نام شخص را وارد کنید..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-emerald-500 font-medium"
          />
          <Search className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 right-4" />
        </div>
        <button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          جستجو
        </button>
      </div>

      {selectedLoan && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-1">
                وام شماره {selectedLoan.loanNumber || selectedLoan.id}
              </h2>
              <div className="text-gray-500 font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>شخص: {getPersonName(selectedLoan.personId)}</span>
                <span className="mx-2">|</span>
                <span>مبلغ: {formatCurrency(selectedLoan.amount)} تومان</span>
              </div>
            </div>
            <button onClick={handlePrint} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Printer className="w-5 h-5" />
              چاپ دفترچه اقساط
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loanInstallments.map((inst, idx) => (
              <div key={inst.id} className={`p-4 rounded-2xl border-2 ${inst.status === 'paid' ? 'border-emerald-100 bg-emerald-50' : inst.status === 'overdue' ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-700 bg-gray-100/50 px-3 py-1 rounded-lg text-sm">
                    قسط {inst.installmentNumber || (idx + 1)}
                  </span>
                  {inst.status === 'paid' ? (
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-md">پرداخت شده</span>
                  ) : inst.status === 'overdue' ? (
                    <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded-md">معوق</span>
                  ) : (
                    <span className="text-amber-600 text-xs font-bold bg-amber-100 px-2 py-1 rounded-md">در انتظار</span>
                  )}
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">{formatCurrency(inst.amount)} <span className="text-sm font-medium text-gray-500">تومان</span></div>
                <div className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  سررسید: {inst.dueDate}
                </div>
                {inst.status !== 'paid' ? (
                  <button onClick={() => handlePay(inst)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-sm transition-all flex justify-center items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    ثبت پرداخت
                  </button>
                ) : (
                  <div className="w-full bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl text-sm text-center">
                    پرداخت شده در {inst.paidDate}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hidden Print Booklet */}
          <div className="hidden">
            <div ref={bookletRef} className="p-8 font-sans print:w-[148mm] print:h-[210mm] mx-auto print:p-6" dir="rtl" style={{ width: '100%', maxWidth: '210mm' }}>
              <style>
                {`
                  @media print {
                    @page { size: A5; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  }
                `}
              </style>
              <div className="text-center mb-8 pb-4 border-b-2 border-gray-800">
                <h1 className="text-2xl font-black mb-2">دفترچه اقساط</h1>
                <p className="text-lg font-bold">وام شماره: {selectedLoan.loanNumber || selectedLoan.id}</p>
                <p className="font-medium mt-1">نام وام‌گیرنده: {getPersonName(selectedLoan.personId)}</p>
                <p className="font-medium mt-1">مبلغ وام: {formatCurrency(selectedLoan.amount)} تومان</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {loanInstallments.map((inst, idx) => (
                  <div key={inst.id} className="border-2 border-gray-400 rounded-xl p-4 flex flex-col justify-between bg-white h-[120px] shadow-sm print:shadow-none" style={{ breakInside: 'avoid' }}>
                    <div className="flex justify-between items-center mb-4 border-b border-dashed border-gray-400 pb-2">
                      <span className="font-bold text-lg">قسط {inst.installmentNumber || (idx + 1)}</span>
                      <span className="font-bold">{inst.dueDate}</span>
                    </div>
                    <div className="mb-4">
                      <p className="font-medium text-gray-600">مبلغ قسط:</p>
                      <p className="font-black text-xl">{formatCurrency(inst.amount)} <span className="text-sm font-medium">تومان</span></p>
                    </div>
                    <div className="mt-auto border-t border-gray-400 pt-2 flex justify-between text-sm">
                      <span className="text-gray-500">مهر و امضا:</span>
                      <span className="text-gray-500">تاریخ پرداخت: ......................</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
