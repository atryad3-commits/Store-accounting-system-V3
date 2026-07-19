import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

start_idx = app_content.find('isPersonModalOpen && window.innerWidth >= 768 && (')
if start_idx == -1: 
    print("Cannot find person modal")
    sys.exit(1)
end_idx = app_content.find('isAccountModalOpen && (', start_idx)

jsx_start = app_content.find('<div key="isPersonModalOpen-modal"', start_idx)
jsx_end = app_content.rfind('</div>', start_idx, end_idx) + 6
jsx_content = app_content[jsx_start:jsx_end].strip()

# find handleSubmitPerson
handler_start = app_content.find('const handleSubmitPerson = async')
handler_end = app_content.find('const handleFastSavePerson', handler_start)
if handler_end == -1: handler_end = app_content.find('const handleDeletePerson', handler_start)
handler_content = app_content[handler_start:handler_end]

handler_content = handler_content.replace('await fetchDataSilent();', 'onSuccess();')
handler_content = handler_content.replace('setIsPersonModalOpen(false);', 'onClose();')
handler_content = handler_content.replace('setEditingPersonId(null);', '')
handler_content = handler_content.replace('setSuccessMsg(', 'showNotification(')
handler_content = handler_content.replace('("شخص با موفقیت ویرایش شد.");', '("شخص با موفقیت ویرایش شد.", "success");')
handler_content = handler_content.replace('("شخص جدید با موفقیت ثبت شد.");', '("شخص جدید با موفقیت ثبت شد.", "success");')

jsx_content = jsx_content.replace('setIsPersonModalOpen(false)', 'onClose()')

new_file_content = """import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, X, Check, Search, CreditCard, Building, MapPin, Tag } from "lucide-react";
import { toPersianDigits } from "../../utils/format";
import { addPerson, updatePerson } from "../../services/dataService";

interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPersonId: string | null;
  persons: any[];
  personGroups: any[];
  personRoles: any[];
  onSuccess: (addedPerson?: any) => void;
  showNotification: (msg: string, type?: 'success'|'error'|'info'|'warning') => void;
  confirmAction: (msg: string, onConfirm: () => void) => void;
}

export default function PersonFormModal({
  isOpen,
  onClose,
  editingPersonId,
  persons,
  personGroups,
  personRoles,
  onSuccess,
  showNotification,
  confirmAction
}: PersonFormModalProps) {
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonRole, setNewPersonRole] = useState<string>("customer");
  const [newPersonMobile, setNewPersonMobile] = useState("");
  const [newPersonType, setNewPersonType] = useState<"real" | "legal">("real");
  const [newPersonNationalId, setNewPersonNationalId] = useState("");
  const [newPersonCode, setNewPersonCode] = useState("");
  const [newPersonPhone, setNewPersonPhone] = useState("");
  const [newPersonPostalCode, setNewPersonPostalCode] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [newPersonAddress, setNewPersonAddress] = useState("");
  const [newPersonDescription, setNewPersonDescription] = useState("");
  const [newPersonProvince, setNewPersonProvince] = useState("");
  const [newPersonCity, setNewPersonCity] = useState("");
  const [newPersonCreditLimit, setNewPersonCreditLimit] = useState("");
  const [newPersonGroupId, setNewPersonGroupId] = useState("");
  const [newPersonRoleId, setNewPersonRoleId] = useState("");
  const [newPersonCompany, setNewPersonCompany] = useState("");
  const [newPersonEconomicCode, setNewPersonEconomicCode] = useState("");
  const [newPersonRegistrationNumber, setNewPersonRegistrationNumber] = useState("");
  const [personFormTab, setPersonFormTab] = useState<"general" | "contact" | "financial">("general");
  const [submittingPerson, setSubmittingPerson] = useState(false);

  const customAlert = (msg: string) => showNotification(msg, 'error');
  const setNotification = (n: any) => showNotification(n.message, n.type);
  const setSuccessMsg = (msg: string) => showNotification(msg, 'success');

  useEffect(() => {
    if (isOpen) {
      if (editingPersonId) {
        const person = persons.find(p => p.id === editingPersonId);
        if (person) {
          setNewPersonName(person.name || "");
          setNewPersonRole(person.role || "customer");
          setNewPersonMobile(person.mobile || "");
          setNewPersonType(person.type || "real");
          setNewPersonNationalId(person.nationalId || "");
          setNewPersonCode(person.code || "");
          setNewPersonPhone(person.phone || "");
          setNewPersonPostalCode(person.postalCode || "");
          setNewPersonEmail(person.email || "");
          setNewPersonAddress(person.address || "");
          setNewPersonDescription(person.description || "");
          setNewPersonProvince(person.province || "");
          setNewPersonCity(person.city || "");
          setNewPersonCreditLimit(person.creditLimit ? String(person.creditLimit) : "");
          setNewPersonGroupId(person.groupId || "");
          setNewPersonRoleId(person.roleId || "");
          setNewPersonCompany(person.company || "");
          setNewPersonEconomicCode(person.economicCode || "");
          setNewPersonRegistrationNumber(person.registrationNumber || "");
        }
      } else {
        setNewPersonName("");
        setNewPersonRole("customer");
        setNewPersonMobile("");
        setNewPersonType("real");
        setNewPersonNationalId("");
        setNewPersonCode("");
        setNewPersonPhone("");
        setNewPersonPostalCode("");
        setNewPersonEmail("");
        setNewPersonAddress("");
        setNewPersonDescription("");
        setNewPersonProvince("");
        setNewPersonCity("");
        setNewPersonCreditLimit("");
        setNewPersonGroupId("");
        setNewPersonRoleId("");
        setNewPersonCompany("");
        setNewPersonEconomicCode("");
        setNewPersonRegistrationNumber("");
      }
      setPersonFormTab("general");
    }
  }, [isOpen, editingPersonId, persons]);

__HANDLER__

  if (!isOpen) return null;

  return (
__JSX__
  );
}
"""

new_file_content = new_file_content.replace('__HANDLER__', handler_content).replace('__JSX__', jsx_content)

with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
    f.write(new_file_content)

print("Generated src/components/modals/PersonFormModal.tsx")
