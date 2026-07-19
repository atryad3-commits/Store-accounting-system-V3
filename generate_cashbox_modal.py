import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

start_idx = app_content.find('isCashboxModalOpen && (')
if start_idx == -1: 
    print("Cannot find cashbox modal")
    sys.exit(1)
end_idx = app_content.find('isWarehouseModalOpen && (', start_idx)

jsx_start = app_content.find('<div key="isCashboxModalOpen-modal"', start_idx)
jsx_end = app_content.rfind('</div>', start_idx, end_idx) + 6
jsx_content = app_content[jsx_start:jsx_end].strip()

# find handleSubmitCashbox
handler_start = app_content.find('const handleSubmitCashbox = async')
handler_end = app_content.find('const handleDeleteCashbox', handler_start)
handler_content = app_content[handler_start:handler_end]

handler_content = handler_content.replace('await fetchDataSilent();', 'onSuccess();')
handler_content = handler_content.replace('setIsCashboxModalOpen(false);', 'onClose();')
handler_content = handler_content.replace('setEditingCashboxId(null);', '')
handler_content = handler_content.replace('setSuccessMsg(', 'showNotification(')
handler_content = handler_content.replace('("صندوق با موفقیت ویرایش شد.");', '("صندوق با موفقیت ویرایش شد.", "success");')
handler_content = handler_content.replace('("صندوق جدید با موفقیت ثبت شد.");', '("صندوق جدید با موفقیت ثبت شد.", "success");')

jsx_content = jsx_content.replace('setIsCashboxModalOpen(false)', 'onClose()')

new_file_content = """import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Wallet, X, Check } from "lucide-react";
import { addCashbox, updateCashbox } from "../../services/dataService";

interface CashboxFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCashboxId: string | null;
  cashboxes: any[];
  onSuccess: () => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
}

export default function CashboxFormModal({
  isOpen,
  onClose,
  editingCashboxId,
  cashboxes,
  onSuccess,
  showNotification,
  confirmAction
}: CashboxFormModalProps) {
  const [newCashboxName, setNewCashboxName] = useState("");
  const [newCashboxManager, setNewCashboxManager] = useState("");
  const [newCashboxStatus, setNewCashboxStatus] = useState(true);
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

__HANDLER__

  if (!isOpen) return null;

  return (
__JSX__
  );
}
"""

new_file_content = new_file_content.replace('__HANDLER__', handler_content).replace('__JSX__', jsx_content)

with open('src/components/modals/CashboxFormModal.tsx', 'w') as f:
    f.write(new_file_content)

print("Generated src/components/modals/CashboxFormModal.tsx")
