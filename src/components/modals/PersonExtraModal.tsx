import React, { useState } from 'react';
import { X, Check, FileText, CreditCard, Plus, Trash2 } from 'lucide-react';
import { updatePerson } from '../../services/dataService';

export default function PersonExtraModal({
  isOpen,
  onClose,
  personId,
  persons,
  onSuccess,
  showNotification
}: any) {
  const person = persons?.find((p: any) => p.id === personId);
  const [notes, setNotes] = useState(person?.additionalNotes || '');
  const [bankAccounts, setBankAccounts] = useState<any[]>(person?.bankAccounts || []);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (person) {
      setNotes(person.additionalNotes || '');
      setBankAccounts(person.bankAccounts || []);
    }
  }, [person]);

  if (!isOpen || !person) return null;

  const handleAddAccount = () => {
    setBankAccounts([...bankAccounts, { bankName: '', accountNo: '', cardNo: '', sheba: '' }]);
  };

  const handleAccountChange = (index: number, field: string, value: string) => {
    const newAccounts = [...bankAccounts];
    newAccounts[index][field] = value;
    setBankAccounts(newAccounts);
  };

  const handleRemoveAccount = (index: number) => {
    const newAccounts = [...bankAccounts];
    newAccounts.splice(index, 1);
    setBankAccounts(newAccounts);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePerson(person.id, {
        ...person,
        additionalNotes: notes,
        bankAccounts: bankAccounts.filter(a => a.bankName || a.accountNo || a.cardNo || a.sheba)
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e: any) {
      if (showNotification) showNotification(e.message || 'خطا در ذخیره اطلاعات', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            اطلاعات تکمیلی بانکی و یادداشت‌ها
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">یادداشت‌های اختصاصی</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هرگونه یادداشت، توافقات، شرایط پرداخت، یا سوابق پیگیری را اینجا بنویسید..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-slate-700 resize-none outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">حساب‌های بانکی</label>
              <button
                onClick={handleAddAccount}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                افزودن حساب
              </button>
            </div>
            
            <div className="space-y-3">
              {bankAccounts.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-sm">
                  هیچ حساب بانکی ثبت نشده است
                </div>
              ) : (
                bankAccounts.map((acc, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 relative group">
                    <button
                      onClick={() => handleRemoveAccount(i)}
                      className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8 md:pr-0">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">نام بانک</label>
                        <input
                          type="text"
                          value={acc.bankName}
                          onChange={(e) => handleAccountChange(i, 'bankName', e.target.value)}
                          placeholder="مثال: ملت"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">شماره حساب</label>
                        <input
                          type="text"
                          value={acc.accountNo}
                          onChange={(e) => handleAccountChange(i, 'accountNo', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-left dir-ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">شماره کارت</label>
                        <input
                          type="text"
                          value={acc.cardNo}
                          onChange={(e) => handleAccountChange(i, 'cardNo', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-left dir-ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">شماره شبا (IR)</label>
                        <input
                          type="text"
                          value={acc.sheba}
                          onChange={(e) => handleAccountChange(i, 'sheba', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-left dir-ltr"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'در حال ذخیره...' : (
              <>
                <Check className="w-5 h-5" />
                ذخیره اطلاعات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
