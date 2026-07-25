import React from 'react';
import { X } from 'lucide-react';
import PersonNotesAndAttachments from '../financial/PersonNotesAndAttachments';
import { updatePerson } from '../../services/dataService';

export default function PersonExtraInfoModal({
  isOpen,
  onClose,
  personId,
  persons,
  fetchPersons,
  showNotification
}: any) {
  if (!isOpen || !personId) return null;
  const person = persons.find((p: any) => p.id === personId);
  if (!person) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            اطلاعات تکمیلی و یادداشت‌ها: {person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim()}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <PersonNotesAndAttachments
            person={person}
            onDataChange={() => fetchPersons()}
            showNotification={showNotification}
          />
        </div>
      </div>
    </div>
  );
}
