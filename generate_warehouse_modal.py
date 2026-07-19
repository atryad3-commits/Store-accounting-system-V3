import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

start_idx = app_content.find('isWarehouseModalOpen && (')
if start_idx == -1: 
    print("Cannot find warehouse modal")
    sys.exit(1)
end_idx = app_content.find('isClear', start_idx)

jsx_start = app_content.find('<div key="isWarehouseModalOpen-modal"', start_idx)
jsx_end = app_content.rfind('</div>', start_idx, end_idx) + 6
jsx_content = app_content[jsx_start:jsx_end].strip()

# find handleSubmitWarehouse
handler_start = app_content.find('const handleSubmitWarehouse = async')
handler_end = app_content.find('const handleDeleteWarehouse', handler_start)
handler_content = app_content[handler_start:handler_end]

handler_content = handler_content.replace('await fetchDataSilent();', 'onSuccess();')
handler_content = handler_content.replace('setIsWarehouseModalOpen(false);', 'onClose();')
handler_content = handler_content.replace('setEditingWarehouseId(null);', '')
handler_content = handler_content.replace('setSuccessMsg(', 'showNotification(')
handler_content = handler_content.replace('("انبار با موفقیت ویرایش شد.");', '("انبار با موفقیت ویرایش شد.", "success");')
handler_content = handler_content.replace('("انبار جدید با موفقیت ثبت شد.");', '("انبار جدید با موفقیت ثبت شد.", "success");')

jsx_content = jsx_content.replace('setIsWarehouseModalOpen(false)', 'onClose()')

new_file_content = """import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Store, X, Check } from "lucide-react";
import { addWarehouse, updateWarehouse } from "../../services/dataService";

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWarehouseId: string | null;
  warehouses: any[];
  onSuccess: () => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
}

export default function WarehouseFormModal({
  isOpen,
  onClose,
  editingWarehouseId,
  warehouses,
  onSuccess,
  showNotification,
  confirmAction
}: WarehouseFormModalProps) {
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseManager, setNewWarehouseManager] = useState("");
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("");
  const [newWarehouseStatus, setNewWarehouseStatus] = useState(true);
  const [submittingWarehouse, setSubmittingWarehouse] = useState(false);

  const customAlert = (msg: string) => showNotification(msg, 'error');

  useEffect(() => {
    if (isOpen) {
      if (editingWarehouseId) {
        const wh = warehouses.find(w => w.id === editingWarehouseId);
        if (wh) {
          setNewWarehouseName(wh.name || "");
          setNewWarehouseManager(wh.manager || "");
          setNewWarehouseLocation(wh.location || "");
          setNewWarehouseStatus(wh.status !== false);
        }
      } else {
        setNewWarehouseName("");
        setNewWarehouseManager("");
        setNewWarehouseLocation("");
        setNewWarehouseStatus(true);
      }
    }
  }, [isOpen, editingWarehouseId, warehouses]);

__HANDLER__

  if (!isOpen) return null;

  return (
__JSX__
  );
}
"""

new_file_content = new_file_content.replace('__HANDLER__', handler_content).replace('__JSX__', jsx_content)

with open('src/components/modals/WarehouseFormModal.tsx', 'w') as f:
    f.write(new_file_content)

print("Generated src/components/modals/WarehouseFormModal.tsx")
