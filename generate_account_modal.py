import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

start_idx = app_content.find('isAccountModalOpen && (')
if start_idx == -1: 
    print("Cannot find account modal")
    sys.exit(1)
end_idx = app_content.find('isCashboxModalOpen && (', start_idx)

jsx_start = app_content.find('<div key="isAccountModalOpen-modal"', start_idx)
jsx_end = app_content.rfind('</div>', start_idx, end_idx) + 6
jsx_content = app_content[jsx_start:jsx_end].strip()

# find handleSubmitAccount
handler_start = app_content.find('const handleSubmitAccount = async')
handler_end = app_content.find('const handleDeleteAccount', handler_start)
handler_content = app_content[handler_start:handler_end]

handler_content = handler_content.replace('await fetchDataSilent();', 'onSuccess();')
handler_content = handler_content.replace('setIsAccountModalOpen(false);', 'onClose();')
handler_content = handler_content.replace('setEditingAccountId(null);', '')
handler_content = handler_content.replace('setSuccessMsg(', 'showNotification(')
handler_content = handler_content.replace('("حساب با موفقیت ویرایش شد.");', '("حساب با موفقیت ویرایش شد.", "success");')
handler_content = handler_content.replace('("حساب جدید با موفقیت ثبت شد.");', '("حساب جدید با موفقیت ثبت شد.", "success");')

jsx_content = jsx_content.replace('setIsAccountModalOpen(false)', 'onClose()')

new_file_content = """import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CreditCard, X, Check } from "lucide-react";
import { addAccount, updateAccount } from "../../services/dataService";

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccountId: string | null;
  accounts: any[];
  onSuccess: () => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
}

export default function AccountFormModal({
  isOpen,
  onClose,
  editingAccountId,
  accounts,
  onSuccess,
  showNotification,
  confirmAction
}: AccountFormModalProps) {
  const [newAccountBankName, setNewAccountBankName] = useState("");
  const [newAccountBranch, setNewAccountBranch] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountCardNumber, setNewAccountCardNumber] = useState("");
  const [newAccountShaba, setNewAccountShaba] = useState("");
  const [newAccountOwner, setNewAccountOwner] = useState("");
  const [newAccountStatus, setNewAccountStatus] = useState(true);
  const [submittingAccount, setSubmittingAccount] = useState(false);

  const customAlert = (msg: string) => showNotification(msg, 'error');

  useEffect(() => {
    if (isOpen) {
      if (editingAccountId) {
        const acc = accounts.find(a => a.id === editingAccountId);
        if (acc) {
          setNewAccountBankName(acc.bankName || "");
          setNewAccountBranch(acc.branch || "");
          setNewAccountNumber(acc.accountNumber || "");
          setNewAccountCardNumber(acc.cardNumber || "");
          setNewAccountShaba(acc.shaba || "");
          setNewAccountOwner(acc.owner || "");
          setNewAccountStatus(acc.status !== false);
        }
      } else {
        setNewAccountBankName("");
        setNewAccountBranch("");
        setNewAccountNumber("");
        setNewAccountCardNumber("");
        setNewAccountShaba("");
        setNewAccountOwner("");
        setNewAccountStatus(true);
      }
    }
  }, [isOpen, editingAccountId, accounts]);

__HANDLER__

  if (!isOpen) return null;

  return (
__JSX__
  );
}
"""

new_file_content = new_file_content.replace('__HANDLER__', handler_content).replace('__JSX__', jsx_content)

with open('src/components/modals/AccountFormModal.tsx', 'w') as f:
    f.write(new_file_content)

print("Generated src/components/modals/AccountFormModal.tsx")
