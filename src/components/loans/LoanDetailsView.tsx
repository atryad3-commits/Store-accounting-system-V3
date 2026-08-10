import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Layers, Percent, Wallet, Printer, Trash2, List, Settings, CheckCircle, ArrowLeftRight } from 'lucide-react';
import { Loan, Installment } from '../../types';
import { formatDateDisplay } from '../../utils/format';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  installments: Installment[];
  formatCurrency: (val: number) => string;
  getPersonName: (id: string | number) => string;
  userRole: string;
  handleUpdateLoanStatus: (loanId: string | number, newStatus: string) => Promise<void>;
  handleDeleteLoan: (loanId: string | number) => void;
  setPrintingLoanId: (id: string | null) => void;
  onPayInstallment: (loanId: string) => void;
  LOAN_STATUS_LABELS: Record<string, string>;
  LOAN_STATUS_COLORS: Record<string, string>;
  isSubmitting?: boolean;
}

export default function LoanDetailsView({
  isOpen,
  onClose,
  loan,
  installments,
  formatCurrency,
  getPersonName,
  userRole,
  handleUpdateLoanStatus,
  handleDeleteLoan,
  setPrintingLoanId,
  onPayInstallment,
  LOAN_STATUS_LABELS,
  LOAN_STATUS_COLORS,
  isSubmitting
}: Props) {
  if (!loan) return null;

  const loanInsts = (installments || []).filter(i => i.loanId === loan.id);
  const paidInsts = loanInsts.filter(i => i.status === 'paid').length;
  const totalInsts = loanInsts.length;

  if (!isOpen || !loan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full"
      dir="rtl"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${loan.type === 'given' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Wallet className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-800">جزئیات پرونده وام</h2>
              <p className="text-sm text-gray-500 mt-1">شماره وام: <span className="font-mono">{loan.loanNumber || loan.id}</span></p>
           </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
        >
          <span>بازگشت به لیست</span>
        </button>
      </div>

      <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">مبلغ وام</div>
                  <div className="text-lg font-black font-mono text-gray-900" dir="ltr">{formatCurrency(loan.amount)}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">تاریخ پرداخت</div>
                  <div className="text-lg font-bold text-gray-900">{formatDateDisplay(loan.startDate.replace(/\-/g, '/'))}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">اقساط</div>
                  <div className="text-lg font-bold text-gray-900">{totalInsts} {loan.frequency === 'yearly' ? '(سالانه)' : loan.frequency === 'quarterly' ? '(فصلی)' : '(ماهانه)'}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">پیشرفت پرداخت</div>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(paidInsts/totalInsts)*100}%`}}></div>
                     </div>
                     <span className="text-sm font-bold text-emerald-600">{paidInsts}/{totalInsts}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                 <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                    تغییر وضعیت وام
                 </h4>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {['requested', 'incomplete', 'completed_dossier', 'approved', 'active', 'completed'].map(st => {
                       const isActive = loan.status === st;
                       const statusLabels = {
                          requested: 'درخواست',
                          incomplete: 'نقص پرونده',
                          completed_dossier: 'تکمیل پرونده',
                          approved: 'تایید شده',
                          active: 'پرداخت شده / فعال',
                          completed: 'تسویه شده'
                       };
                       return (
                          <button
                             key={st}
                             onClick={() => handleUpdateLoanStatus(loan.id, st)}
                             disabled={isSubmitting}
                             className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50'} disabled:opacity-50`}
                          >
                             {isActive && <CheckCircle className="w-4 h-4" />}
                             {statusLabels[st as keyof typeof statusLabels]}
                          </button>
                       );
                    })}
                 </div>
                 
                 {loan.history && loan.history.length > 0 && (
                   <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5">
                      <h5 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                         <Layers className="w-4 h-4" />
                         تاریخچه وضعیت‌ها
                      </h5>
                      <div className="space-y-3">
                         {loan.history.map((hist, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${LOAN_STATUS_COLORS[hist.status] || 'bg-gray-100 text-gray-700'}`}>
                                     {LOAN_STATUS_LABELS[hist.status] || hist.status}
                                  </span>
                                  <span className="text-sm font-medium text-gray-600">{hist.desc}</span>
                               </div>
                               <div className="text-xs text-gray-400 mt-2 sm:mt-0 font-mono" dir="ltr">
                                  {new Date(hist.date).toLocaleString('fa-IR')}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="font-black text-gray-800 flex items-center gap-2">
                          <List className="w-5 h-5 text-emerald-500" />
                          گزارش اقساط
                       </h4>
                       <button
                          onClick={() => onPayInstallment(loan.id as string)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                       >
                          <CheckCircle className="w-4 h-4" />
                          ثبت پرداختی قسط
                       </button>
                    </div>
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm max-h-[400px] overflow-y-auto">
                       <table className="w-full text-sm text-right relative">
                          <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 sticky top-0 z-10">
                             <tr>
                                <th className="p-3">ردیف</th>
                                <th className="p-3">سررسید</th>
                                <th className="p-3">مبلغ قسط</th>
                                <th className="p-3">وضعیت</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             {loanInsts.map((inst, idx) => (
                                <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="p-3 font-bold text-gray-600">{idx + 1}</td>
                                   <td className="p-3 font-mono font-medium">{formatDateDisplay(inst.dueDate.replace(/\-/g, '/'))}</td>
                                   <td className="p-3 font-black text-gray-900" dir="ltr">{formatCurrency(inst.amount)}</td>
                                   <td className="p-3">
                                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${inst.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : inst.status === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                         {inst.status === 'paid' ? 'پرداخت شده' : inst.status === 'overdue' ? 'معوق' : 'سررسید نشده'}
                                      </span>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>

                 <div className="w-full lg:w-64">
                    <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                       <Settings className="w-5 h-5 text-gray-500" />
                       عملیات
                    </h4>
                    <div className="space-y-3">
                       <button
                          onClick={() => setPrintingLoanId(loan.id as string)}
                          className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-colors shadow-sm"
                       >
                          <Printer className="w-5 h-5 text-gray-400" />
                          چاپ دفترچه اقساط
                       </button>
                       {(userRole === 'admin' || userRole === 'manager') && (
                          <button
                             onClick={() => {
                               handleDeleteLoan(loan.id);
                               onClose();
                             }}
                             className="w-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-colors shadow-sm"
                          >
                             <Trash2 className="w-5 h-5 text-rose-400" />
                             حذف کامل وام
                          </button>
                       )}
                    </div>
                 </div>
              </div>
      </div>
    </motion.div>
  );
}
