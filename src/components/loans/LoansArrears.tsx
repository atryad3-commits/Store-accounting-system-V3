import React, { useState, useMemo } from 'react';
import { Loan, Installment, Person } from '../../types';
import { addCommas } from '../../utils/format';
import { AlertCircle, Clock, Search, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoansArrearsProps {
  formatCurrency?: (val: number) => string;
  loans: Loan[];
  installments: Installment[];
  persons: Person[];
  storeSettings?: any;
}

export default function LoansArrears({ 
  formatCurrency = (val: number) => Number(val).toLocaleString("fa-IR") + " تومان",
  loans, installments, persons, storeSettings
}: LoansArrearsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');

  const overdueInstallments = useMemo(() => {
    let overdue = installments
      .filter(i => i.status === 'pending' && i.dueDate < today)
      .map(inst => {
        const loan = loans.find(l => l.id === inst.loanId);
        const loanInsts = installments.filter(i => i.loanId === inst.loanId).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
        const installmentNumber = loanInsts.findIndex(i => i.id === inst.id) + 1;
        const person = persons.find(p => p.id === loan?.personId);
        
        // Calculate days overdue
        // Simple approximation for UI sorting (not exact calendar days)
        const d1 = new Date(inst.dueDate.replace(/-/g, '/')).getTime();
        const d2 = new Date(today.replace(/-/g, '/')).getTime();
        const daysOverdue = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

        return {
          ...inst,
          loan,
          person,
          daysOverdue,
          installmentNumber
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      overdue = overdue.filter(i => i.person?.name.toLowerCase().includes(lower) || i.loan?.loanNumber?.toString().includes(lower) || i.loan?.id.toString().includes(lower));
    }

    return overdue;
  }, [installments, loans, persons, today, searchTerm]);

  const totalOverdueAmount = overdueInstallments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">مدیریت معوقات</h2>
            <p className="text-sm text-gray-500 mt-1">پیگیری و مدیریت اقساط سررسید گذشته</p>
          </div>
        </div>
        <div className="bg-rose-50 px-6 py-4 rounded-xl border border-rose-100 text-center min-w-[200px]">
           <p className="text-sm text-rose-600 font-bold mb-1">جمع کل معوقات</p>
           <p className="text-2xl font-black text-rose-700 font-mono" dir="ltr">{formatCurrency(totalOverdueAmount)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="جستجو در نام وام‌گیرنده یا شماره وام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            تعداد: <span className="font-black text-gray-900">{overdueInstallments.length}</span> مورد
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">وام‌گیرنده</th>
                <th className="px-6 py-4">شماره وام / قسط</th>
                <th className="px-6 py-4">سررسید</th>
                <th className="px-6 py-4">تأخیر (روز)</th>
                <th className="px-6 py-4">مبلغ معوق ({storeSettings?.currency || "تومان"})</th>
                <th className="px-6 py-4">عملیات پیگیری</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueInstallments.map((inst, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={inst.id} 
                  className="hover:bg-rose-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{inst.person?.name || 'نامشخص'}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3"/> {inst.person?.phone || 'ندارد'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>وام: <span className="font-mono">{inst.loan?.loanNumber || inst.loan?.id || inst.loanId}</span></div>
                    <div className="text-xs mt-1">قسط شماره: {inst.installmentNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-rose-600 font-medium font-mono" dir="ltr">{inst.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      inst.daysOverdue > 30 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inst.daysOverdue} روز
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black font-mono text-gray-900" dir="ltr">{addCommas(inst.amount)}</td>
                  <td className="px-6 py-4">
                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        ثبت پیگیری
                     </button>
                  </td>
                </motion.tr>
              ))}
              {overdueInstallments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                    موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
