import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  Palette,
  Check,
  AlertTriangle,
  RotateCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  getPersonGroups,
  addPersonGroup,
  updatePersonGroup,
  deletePersonGroup,
  getPersons,
  updatePerson,
} from "../../services/dataService";
import { Person, PersonGroup } from "../../types";

interface PersonGroupsManagerProps {
  showNotification: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

const colorPresets = [
  { value: "indigo", label: "نیلی", bg: "bg-indigo-50", text: "text-indigo-850", border: "border-indigo-200", dot: "bg-indigo-500" },
  { value: "emerald", label: "زمردی", bg: "bg-emerald-50", text: "text-emerald-850", border: "border-emerald-200", dot: "bg-emerald-500" },
  { value: "rose", label: "سرخ", bg: "bg-rose-50", text: "text-rose-850", border: "border-rose-200", dot: "bg-rose-500" },
  { value: "amber", label: "کهربایی", bg: "bg-amber-50", text: "text-amber-850", border: "border-amber-200", dot: "bg-amber-500" },
  { value: "purple", label: "بنفش", bg: "bg-purple-50", text: "text-purple-850", border: "border-purple-200", dot: "bg-purple-500" },
  { value: "cyan", label: "فیروزه‌ای", bg: "bg-cyan-50", text: "text-cyan-850", border: "border-cyan-200", dot: "bg-cyan-500" },
  { value: "orange", label: "پرتقالی", bg: "bg-orange-50", text: "text-orange-850", border: "border-orange-200", dot: "bg-orange-500" },
  { value: "slate", label: "سنگی", bg: "bg-slate-50", text: "text-slate-800", border: "border-slate-200", dot: "bg-slate-500" },
];

export default function PersonGroupsManager({ showNotification }: PersonGroupsManagerProps) {
  const [groups, setGroups] = useState<PersonGroup[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("indigo");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedGroups = await getPersonGroups();
      const fetchedPersons = await getPersons();
      setGroups(fetchedGroups || []);
      setPersons(fetchedPersons || []);
    } catch (error) {
      console.error("Error loading groups data", error);
      showNotification("خطا در بارگذاری اطلاعات گروه‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingGroupId(null);
    setGroupName("");
    setGroupColor("indigo");
    setIsModalOpen(true);
  };

  const handleStartEdit = (group: PersonGroup) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupColor(group.color || "indigo");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      showNotification("لطفاً نام گروه را وارد کنید", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingGroupId) {
        await updatePersonGroup(editingGroupId, {
          name: groupName.trim(),
          color: groupColor,
        });
        showNotification("گروه با موفقیت ویرایش شد", "success");
      } else {
        await addPersonGroup({
          name: groupName.trim(),
          color: groupColor,
        });
        showNotification("گروه جدید با موفقیت ایجاد شد", "success");
      }
      
      // Reset form and reload
      setGroupName("");
      setGroupColor("indigo");
      setEditingGroupId(null);
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error saving group", error);
      showNotification("خطا در ذخیره‌سازی اطلاعات", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingGroupId(null);
    setGroupName("");
    setGroupColor("indigo");
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersonGroup(id);

      // Remove group from all persons belonging to this group
      const affectedPersons = (persons || []).filter((p) => p.group === id);
      let updatedCount = 0;
      for (const p of affectedPersons) {
        if (p.id) {
          await updatePerson(p.id as string, { ...p, group: "" });
          updatedCount++;
        }
      }

      showNotification(
        `گروه با موفقیت حذف شد. ${updatedCount > 0 ? `${updatedCount} شخص از این گروه خارج شدند.` : ""}`,
        "success"
      );
      setDeletingGroupId(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting group", error);
      showNotification("خطا در حذف گروه", "error");
    }
  };

  const getGroupMembersCount = (groupId: string) => {
    return (persons || []).filter((p) => p.group === groupId).length;
  };

  const getColorClasses = (colorValue: string) => {
    const preset = colorPresets.find((p) => p.value === colorValue) || colorPresets[0];
    return `${preset.bg} ${preset.text} ${preset.border}`;
  };

  return (
    <div className="font-sans w-full" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </span>
            مدیریت گروه‌های اشخاص
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            دسته‌بندی، تخصیص رنگ‌های متمایز و مدیریت جامع گروه‌های مشتریان، تامین‌کنندگان و همکاران در یک نمای تمام‌صفحه
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-750 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            افزودن گروه جدید
          </button>
        </div>
      </div>

      {loading && groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm w-full">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <Users className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-500 mt-4">در حال دریافت اطلاعات گروه‌ها...</p>
        </div>
      ) : (
        /* Full-Width Groups List Panel */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </span>
              لیست گروه‌های تعریف‌شده
            </h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">
              {groups.length} گروه فعال
            </span>
          </div>

          {groups.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Users className="w-14 h-14 mx-auto mb-4 opacity-25" />
              <p className="text-sm font-bold text-slate-700">هیچ گروهی تعریف نشده است.</p>
              <p className="text-xs text-slate-400 mt-1.5">با کلیک روی دکمه «افزودن گروه جدید»، اولین گروه را بسازید.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 bg-slate-50/30">
                    <th className="px-6 py-4 w-16">ردیف</th>
                    <th className="px-6 py-4">عنوان گروه (رنگ متمایز)</th>
                    <th className="px-6 py-4 w-48">تعداد اعضای فعال</th>
                    <th className="px-6 py-4 w-60 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groups.map((group, index) => {
                    const membersCount = getGroupMembersCount(group.id);
                    const isPendingDelete = deletingGroupId === group.id;

                    return (
                      <tr
                        key={group.id || `key-${Math.random()}`}
                        className={`transition-all hover:bg-slate-50/40 ${
                          isPendingDelete ? "bg-rose-50/30" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-xs font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-black border ${getColorClasses(group.color || "indigo")}`}>
                            {group.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                            <strong>{membersCount}</strong> عضو فعال
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {isPendingDelete ? (
                              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-rose-100 shadow-sm animate-pulse">
                                <span className="text-[10px] font-bold text-rose-700 px-2.5 flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  آیا از حذف گروه اطمینان دارید؟
                                </span>
                                <button
                                  onClick={() => handleDelete(group.id)}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                                >
                                  بله، حذف کن
                                </button>
                                <button
                                  onClick={() => setDeletingGroupId(null)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                                >
                                  انصراف
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(group)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title="ویرایش گروه"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>ویرایش</span>
                                </button>
                                <button
                                  onClick={() => setDeletingGroupId(group.id)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title="حذف گروه"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Standard Modal for Add / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelEdit}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FolderPlus className="w-4 h-4" />
                  </span>
                  <h2 className="text-sm font-black text-slate-800">
                    {editingGroupId ? "ویرایش اطلاعات گروه" : "ایجاد گروه جدید اشخاص"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer border border-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2">نام گروه <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="مثال: مشتریان عمده، نمایندگان علمی، همکاران درجه یک..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-right"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    رنگ و جلوه ظاهری متمایز
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setGroupColor(preset.value)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-[10px] font-black transition-all relative cursor-pointer ${
                          groupColor === preset.value
                            ? `${preset.bg} ${preset.text} border-2 border-indigo-600 scale-[1.03] shadow-sm`
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${preset.dot} mb-1.5`} />
                        {preset.label}
                        {groupColor === preset.value && (
                          <span className="absolute top-1 left-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="pt-4 border-t border-slate-100 bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">پیش‌نمایش گروه</label>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border shadow-sm ${getColorClasses(groupColor)}`}>
                      {groupName || "عنوان گروه شما"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-100">بدون عضو</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingGroupId ? "ثبت تغییرات گروه" : "ایجاد و ذخیره گروه"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
