import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pin, 
  Palette, 
  Archive, 
  Trash2, 
  Search, 
  X, 
  Plus, 
  CheckSquare, 
  Image as ImageIcon,
  MoreVertical,
  Bell
} from "lucide-react";
import { getPersonalNotes, appendPersonalNote, updatePersonalNote, deletePersonalNote, savePersonalNotes } from "../../services/dataService";
import { PersonalNote } from "../../types";

const NOTE_COLORS = [
  { id: 'default', bg: 'bg-white', border: 'border-slate-200', name: 'پیش‌فرض' },
  { id: 'red', bg: 'bg-red-50', border: 'border-red-200', name: 'قرمز' },
  { id: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', name: 'نارنجی' },
  { id: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', name: 'زرد' },
  { id: 'green', bg: 'bg-emerald-50', border: 'border-emerald-200', name: 'سبز' },
  { id: 'teal', bg: 'bg-teal-50', border: 'border-teal-200', name: 'فیروزه‌ای' },
  { id: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', name: 'آبی' },
  { id: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', name: 'نیلی' },
  { id: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', name: 'بنفش' },
  { id: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', name: 'صورتی' },
];

export function PersonalNotesManager({ storeSettings }: any) {
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newColor, setNewColor] = useState("default");
  
  const [editingNote, setEditingNote] = useState<PersonalNote | null>(null);
  const [loading, setLoading] = useState(true);

  const creatorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getPersonalNotes();
      // sort by updated at descending
      const sorted = (data || []).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setNotes(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (creatorRef.current && !creatorRef.current.contains(e.target as Node)) {
        if (isExpanded) {
          handleSaveNewNote();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, newTitle, newContent, newColor]);

  const handleSaveNewNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) {
      setIsExpanded(false);
      setNewColor("default");
      return;
    }

    const note: PersonalNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: newContent,
      color: newColor,
      isPinned: false,
      isArchived: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setIsExpanded(false);
    setNewTitle("");
    setNewContent("");
    setNewColor("default");

    try {
      await appendPersonalNote(note);
    } catch (e) {
      console.error(e);
      // In case append fails (e.g. backend issue), save all
      await savePersonalNotes([note, ...notes]);
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<PersonalNote>) => {
    const updatedNotes = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
    setNotes(updatedNotes);
    
    try {
      await updatePersonalNote(id, { ...updates, updatedAt: new Date().toISOString() });
    } catch (e) {
       await savePersonalNotes(updatedNotes);
    }
  };

  const handleDeleteNote = async (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    try {
      await deletePersonalNote(id);
    } catch(e) {
      await savePersonalNotes(updatedNotes);
    }
  };

  const handleCloseEditModal = () => {
    if (editingNote) {
      handleUpdateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        color: editingNote.color
      });
      setEditingNote(null);
    }
  };

  const getColorClass = (colorId?: string) => {
    const color = NOTE_COLORS.find(c => c.id === (colorId || 'default')) || NOTE_COLORS[0];
    return `${color.bg} ${color.border}`;
  };

  const filteredNotes = notes.filter(n => 
    !n.isArchived && 
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const NoteCard = ({ note }: { note: PersonalNote }) => (
    <div 
      className={`relative group rounded-xl border p-4 mb-4 break-inside-avoid cursor-pointer transition-all hover:shadow-md ${getColorClass(note.color)}`}
      onClick={() => setEditingNote(note)}
    >
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10" onClick={e => e.stopPropagation()}>
         <button 
           onClick={() => handleUpdateNote(note.id, { isPinned: !note.isPinned })}
           className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${note.isPinned ? 'text-indigo-600 opacity-100' : 'text-slate-500'}`}
           title={note.isPinned ? "برداشتن سنجاق" : "سنجاق کردن"}
         >
           <Pin className="w-4 h-4" fill={note.isPinned ? "currentColor" : "none"} />
         </button>
      </div>

      {note.title && (
        <h3 className="font-bold text-slate-800 mb-2 whitespace-pre-wrap pl-6 text-sm">{note.title}</h3>
      )}
      {note.content && (
        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed pb-6 line-clamp-10">{note.content}</p>
      )}

      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
         <div className="flex items-center gap-1">
            <div className="relative group/palette">
                <button className="p-1.5 rounded-full hover:bg-black/5 text-slate-500 transition-colors">
                    <Palette className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full right-0 mb-1 hidden group-hover/palette:flex flex-wrap gap-1 bg-white border border-slate-200 p-2 rounded-xl shadow-xl w-32 z-20">
                    {NOTE_COLORS.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => handleUpdateNote(note.id, { color: c.id })}
                            className={`w-6 h-6 rounded-full cursor-pointer border hover:scale-110 transition-transform ${c.bg} ${c.border} ${note.color === c.id ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>
            <button 
                onClick={() => handleDeleteNote(note.id)}
                className="p-1.5 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                title="حذف یادداشت"
            >
                <Trash2 className="w-4 h-4" />
            </button>
         </div>
         <span className="text-[10px] text-slate-400 font-sans">
             {new Date(note.updatedAt).toLocaleDateString("fa-IR")}
         </span>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto bg-white" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                 <CheckSquare className="w-5 h-5" />
             </div>
             <div>
                 <h1 className="font-black text-lg text-slate-800">یادداشت‌های شخصی</h1>
                 <p className="text-xs text-slate-500 font-bold">فضای کاری و ثبت ایده‌ها (Keep)</p>
             </div>
         </div>
         <div className="relative w-full max-w-md">
             <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
                 type="text" 
                 placeholder="جستجو در یادداشت‌ها..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-100 border-none rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
             />
         </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
          {/* Note Creator */}
          <div className="max-w-2xl mx-auto mb-10 relative z-20">
              <div 
                  ref={creatorRef}
                  className={`bg-white rounded-2xl transition-all shadow-md overflow-hidden ${isExpanded ? 'border border-slate-200 shadow-xl' : 'border border-slate-200 hover:shadow-lg'}`}
              >
                  {isExpanded && (
                      <input
                          type="text"
                          placeholder="عنوان یادداشت..."
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                          className={`w-full px-5 pt-4 pb-2 text-base font-bold text-slate-800 outline-none ${getColorClass(newColor).split(' ')[0]}`}
                      />
                  )}
                  <textarea
                      placeholder={isExpanded ? "یادداشت خود را بنویسید..." : "یک یادداشت جدید ثبت کنید..."}
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      onFocus={() => setIsExpanded(true)}
                      className={`w-full px-5 py-3 text-sm text-slate-700 outline-none resize-none overflow-hidden min-h-[50px] transition-all ${isExpanded ? 'min-h-[120px]' : ''} ${getColorClass(newColor).split(' ')[0]}`}
                  />
                  
                  {isExpanded && (
                      <div className={`flex items-center justify-between px-3 py-2 border-t border-black/5 ${getColorClass(newColor).split(' ')[0]}`}>
                          <div className="flex items-center gap-1">
                             <div className="relative group/palette">
                                <button className="p-2 rounded-full hover:bg-black/5 text-slate-500 transition-colors">
                                    <Palette className="w-4 h-4" />
                                </button>
                                <div className="absolute top-full right-0 mt-1 hidden group-hover/palette:flex flex-wrap gap-1 bg-white border border-slate-200 p-2 rounded-xl shadow-xl w-32 z-20">
                                    {NOTE_COLORS.map(c => (
                                        <div 
                                            key={c.id} 
                                            onClick={() => setNewColor(c.id)}
                                            className={`w-6 h-6 rounded-full cursor-pointer border hover:scale-110 transition-transform ${c.bg} ${c.border} ${newColor === c.id ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                             </div>
                             <button className="p-2 rounded-full hover:bg-black/5 text-slate-500 transition-colors" title="افزودن تصویر">
                                 <ImageIcon className="w-4 h-4" />
                             </button>
                          </div>
                          <button 
                              onClick={handleSaveNewNote}
                              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                              بستن و ذخیره
                          </button>
                      </div>
                  )}
              </div>
          </div>

          {/* Notes Grid */}
          {pinnedNotes.length > 0 && (
              <div className="mb-8">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                      <Pin className="w-3 h-3" /> سنجاق شده‌ها
                  </h3>
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                      {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
                  </div>
              </div>
          )}

          {otherNotes.length > 0 && (
              <div>
                  {pinnedNotes.length > 0 && (
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 px-2">
                          سایر یادداشت‌ها
                      </h3>
                  )}
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                      {otherNotes.map(note => <NoteCard key={note.id} note={note} />)}
                  </div>
              </div>
          )}

          {!loading && notes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                  <CheckSquare className="w-24 h-24 text-slate-300 mb-6" />
                  <h3 className="text-xl font-black text-slate-500">یادداشتی ثبت نشده است</h3>
              </div>
          )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
          {editingNote && (
              <>
                  <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={handleCloseEditModal}
                  />
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl shadow-2xl z-50 flex flex-col max-h-[85vh] ${getColorClass(editingNote.color)}`}
                  >
                      <input
                          type="text"
                          value={editingNote.title}
                          onChange={e => setEditingNote({...editingNote, title: e.target.value})}
                          placeholder="عنوان"
                          className="w-full bg-transparent px-6 py-5 text-xl font-bold text-slate-800 outline-none border-b border-black/5"
                      />
                      <textarea
                          value={editingNote.content}
                          onChange={e => setEditingNote({...editingNote, content: e.target.value})}
                          placeholder="یادداشت خود را بنویسید..."
                          className="w-full flex-1 bg-transparent px-6 py-4 text-sm text-slate-700 outline-none resize-none min-h-[300px]"
                      />
                      
                      <div className="flex items-center justify-between px-4 py-3 bg-black/5 rounded-b-2xl">
                          <div className="flex items-center gap-2">
                             <div className="relative group/palette_modal">
                                <button className="p-2 rounded-full hover:bg-black/10 text-slate-600 transition-colors">
                                    <Palette className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/palette_modal:flex flex-wrap gap-1 bg-white border border-slate-200 p-2 rounded-xl shadow-xl w-36 z-50">
                                    {NOTE_COLORS.map(c => (
                                        <div 
                                            key={c.id} 
                                            onClick={() => setEditingNote({...editingNote, color: c.id})}
                                            className={`w-7 h-7 rounded-full cursor-pointer border hover:scale-110 transition-transform ${c.bg} ${c.border} ${editingNote.color === c.id ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                             </div>
                          </div>
                          <button 
                              onClick={handleCloseEditModal}
                              className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all shadow-md"
                          >
                              ذخیره و بستن
                          </button>
                      </div>
                  </motion.div>
              </>
          )}
      </AnimatePresence>
    </div>
  );
}
