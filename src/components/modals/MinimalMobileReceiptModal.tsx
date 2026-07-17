import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ArrowDownLeft, ArrowUpRight, User, DollarSign, FileText, Wallet } from 'lucide-react';
import Select from 'react-select';
import CurrencyInput from '../common/CurrencyInput';

export default function MinimalMobileReceiptModal(props: any) {
  const {
    isOpen,
    onClose,
    type, // 'receive' or 'pay'
    persons,
    receiptPersonId,
    setReceiptPersonId,
    receiptAmount,
    setReceiptAmount,
    receiptNote,
    setReceiptNote,
    receiptMethod,
    setReceiptMethod,
    handleSubmitReceipt,
    formatNumber,
    submittingReceipt,
    accounts,
    cashboxes,
    receiptResourceType,
    setReceiptResourceType,
    receiptResourceId,
    setReceiptResourceId
  } = props;

  if (!isOpen) return null;

  const personOptions = persons.map((p: any) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const selectedPerson = personOptions.find((p: any) => String(p.value) === String(receiptPersonId)) || null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          dir="rtl"
        >
          <div className={`flex items-center justify-between px-5 py-4 ${type === 'receive' ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${type === 'receive' ? 'bg-emerald-200/50 text-emerald-700' : 'bg-rose-200/50 text-rose-700'}`}>
                {type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black">{type === 'receive' ? 'دریافت سریع' : 'پرداخت سریع'}</h3>
                <p className="text-xs opacity-70 font-bold">{type === 'receive' ? 'ثبت دریافت وجه نقدی' : 'ثبت پرداخت وجه نقدی'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <User className="w-4 h-4" /> شخص / طرف حساب
              </label>
              <Select
                options={personOptions}
                value={selectedPerson}
                onChange={(val: any) => setReceiptPersonId(val ? val.value : '')}
                placeholder="انتخاب شخص..."
                className="font-bold text-sm"
                noOptionsMessage={() => "شخصی یافت نشد"}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    borderColor: '#e2e8f0',
                    padding: '2px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#cbd5e1' }
                  })
                }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> مبلغ (تومان)
              </label>
                            <CurrencyInput
                value={receiptAmount}
                onChange={(e: any) => setReceiptAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-lg"
                placeholder="0"
                inputMode="numeric"
                hideWords={true}
              />
            </div>
            

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Wallet className="w-4 h-4" /> واریز به / برداشت از
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => { setReceiptResourceType('cashbox'); setReceiptResourceId(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${receiptResourceType === 'cashbox' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'} border`}
                >
                  صندوق
                </button>
                <button
                  onClick={() => { setReceiptResourceType('bank'); setReceiptResourceId(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${receiptResourceType === 'bank' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'} border`}
                >
                  حساب بانکی
                </button>
              </div>
              <Select
                options={receiptResourceType === 'cashbox' ? cashboxes.map((c: any) => ({ value: c.id, label: c.name })) : accounts.map((a: any) => ({ value: a.id, label: a.bankName + (a.accountNumber ? ` (${a.accountNumber})` : '') }))}
                value={receiptResourceId ? (receiptResourceType === 'cashbox' ? cashboxes.map((c: any) => ({ value: c.id, label: c.name })) : accounts.map((a: any) => ({ value: a.id, label: a.bankName + (a.accountNumber ? ` (${a.accountNumber})` : '') }))).find((o: any) => String(o.value) === String(receiptResourceId)) : null}
                onChange={(val: any) => setReceiptResourceId(val ? val.value : '')}
                placeholder="انتخاب کنید..."
                className="font-bold text-sm"
                noOptionsMessage={() => "موردی یافت نشد"}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.75rem',
                    borderColor: '#e2e8f0',
                    padding: '2px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#cbd5e1' }
                  })
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-4 h-4" /> بابت / توضیحات
              </label>
              <input
                type="text"
                value={receiptNote}
                onChange={(e) => setReceiptNote(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm"
                placeholder="مثال: تسویه فاکتور..."
              />
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={(e) => handleSubmitReceipt(type, e)}
              disabled={submittingReceipt || !receiptPersonId || !receiptAmount}
              className={`w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
                submittingReceipt || !receiptPersonId || !receiptAmount
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : type === 'receive'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {submittingReceipt ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {submittingReceipt ? 'در حال ثبت...' : 'ثبت سریع سند'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
