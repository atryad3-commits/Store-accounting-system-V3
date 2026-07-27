import React, { useState, useEffect } from "react";
import { startAppProcessing, stopAppProcessing } from "../../utils/processingHelper";
import { motion } from "motion/react";
import CurrencyInput from "../ui/CurrencyInput";
import { Wallet, X, Check, Plus } from "lucide-react";
import { addCashbox, updateCashbox } from "../../services/dataService";

interface CashboxFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCashboxId: any;
  cashboxes: any[];
  storeSettings?: any;
  onSuccess: () => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
}

export default function CashboxFormModal({
  isOpen,
  onClose,
  editingCashboxId,
  cashboxes,
  storeSettings,
  onSuccess,
  showNotification,
  confirmAction
}: CashboxFormModalProps) {
  const [newCashboxName, setNewCashboxName] = useState("");
  const [newCashboxManager, setNewCashboxManager] = useState("");
  const [newCashboxStatus, setNewCashboxStatus] = useState(true);
  const [newCashboxBalance, setNewCashboxBalance] = useState("");
  const [submittingCashbox, setSubmittingCashbox] = useState(false);

  const customAlert = (msg: string) => showNotification(msg, 'error');

  useEffect(() => {
    if (isOpen) {
      if (editingCashboxId) {
        const cb = cashboxes.find(c => c.id === editingCashboxId);
        if (cb) {
          setNewCashboxName(cb.name || "");
          setNewCashboxManager(cb.manager || "");
          setNewCashboxStatus(cb.status !== false);
        }
      } else {
        setNewCashboxName("");
        setNewCashboxManager("");
        setNewCashboxStatus(true);
      }
    }
  }, [isOpen, editingCashboxId, cashboxes]);

const handleSubmitCashbox = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      try { e.preventDefault(); } catch (err) {}
    }
    if (!newCashboxName) return;
    setSubmittingCashbox(true); startAppProcessing('شروع فرآیند ثبت Cashbox...');
    try {
      const isEdit = editingCashboxId !== null;
      const payload = {
        name: newCashboxName,
        manager: newCashboxManager,
        description: newCashboxManager, // For firebase checking description
        initialBalance: Number(newCashboxBalance) || 0,
        balance: Number(newCashboxBalance) || 0,
      };

      if (isEdit) {
        await updateCashbox(editingCashboxId.toString(), payload as any);
      } else {
        await addCashbox(payload as any);
      }

      await onSuccess();
      setNewCashboxName("");
      setNewCashboxManager("");
      setNewCashboxBalance("");
      
      onClose();
      showNotification(
        isEdit ? "صندوق با موفقیت ویرایش شد" : "صندوق با موفقیت ثبت شد",
      );
    } catch (error) {
      console.error("Error saving cashbox", error);
    } finally {
      setSubmittingCashbox(false); stopAppProcessing();
    }
  };

  

  if (!isOpen) return null;

  return (
<div key="isCashboxModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-500" />
                        ثبت صندوق یا تنخواه جدید
                      </h3>
                      <button
                        onClick={() => onClose()}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      id="cashboxForm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        confirmAction("آیا از ثبت صندوق اطمینان دارید؟", () =>
                          handleSubmitCashbox(e as any),
                        );
                      }}
                      className="flex flex-col flex-1 overflow-hidden"
                    >
                      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
                        <div className="flex flex-col gap-4 text-right">
                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام صندوق / تنخواه{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newCashboxName}
                              onChange={(e) =>
                                setNewCashboxName(e.target.value)
                              }
                              placeholder="مثال: صندوق اصلی، تنخواه دفتر"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                              required
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نام مسئول صندوق
                            </label>
                            <input
                              type="text"
                              value={newCashboxManager}
                              onChange={(e) =>
                                setNewCashboxManager(e.target.value)
                              }
                              placeholder="مثال: سارا احمدی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>

                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              موجودی اولیه (تومان)
                            </label>
                            <CurrencyInput
                              value={newCashboxBalance}
                              onChange={(e: any) =>
                                setNewCashboxBalance(e.target.value)
                              }
                              placeholder="مثال: 500000"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
                        <button
                          type="button"
                          onClick={() => onClose()}
                          className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors shadow-sm"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          disabled={submittingCashbox}
                          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {submittingCashbox ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                          <span>ثبت صندوق</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
  );
}
