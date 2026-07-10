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
} from "lucide-react";
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
      await loadData();
    } catch (error) {
      console.error("Error saving group", error);
      showNotification("خطا در ذخیره‌سازی اطلاعات", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setGroupName("");
    setGroupColor("indigo");
  };

  const handleStartEdit = (group: PersonGroup) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupColor(group.color || "indigo");
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersonGroup(id);

      // Remove group from all persons belonging to this group
      const affectedPersons = persons.filter((p) => p.group === id);
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
    return persons.filter((p) => p.group === groupId).length;
  };

  const getColorClasses = (colorValue: string) => {
    const preset = colorPresets.find((p) => p.value === colorValue) || colorPresets[0];
    return `${preset.bg} ${preset.text} ${preset.border}`;
  };

  return (
    <div className="font-sans" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </span>
            مدیریت گروه‌های اشخاص
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            دسته‌بندی، تخصیص رنگ‌های متمایز و مدیریت جامع گروه‌های مشتریان، تامین‌کنندگان و همکاران
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          به‌روزرسانی
        </button>
      </div>

      {loading && groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <Users className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-500 mt-4">در حال دریافت اطلاعات گروه‌ها...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Add / Edit Form Panel */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-indigo-50/50 text-indigo-500">
                <FolderPlus className="w-4 h-4" />
              </span>
              {editingGroupId ? "ویرایش گروه" : "ایجاد گروه جدید"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">نام گروه</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="مثال: مشتریان VIP، همکاران پخش و..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  رنگ و جلوه ظاهری
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setGroupColor(preset.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all relative cursor-pointer ${
                        groupColor === preset.value
                          ? `${preset.bg} ${preset.text} border-2 border-indigo-600 scale-[1.03] shadow-sm`
                          : "bg-white text-slate-500 border-slate-150 hover:border-slate-300"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${preset.dot} mb-1`} />
                      {preset.label}
                      {groupColor === preset.value && (
                        <span className="absolute top-1 left-1 bg-indigo-600 text-white rounded-full p-0.5">
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">پیش‌نمایش گروه</label>
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getColorClasses(groupColor)}`}>
                    {groupName || "عنوان گروه"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">بدون عضو</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/15 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {editingGroupId ? "اعمال تغییرات" : "ثبت و ذخیره"}
                </button>
                {editingGroupId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Groups List Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Users className="w-4 h-4" />
                </span>
                لیست گروه‌های تعریف‌شده
              </h2>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                {groups.length} گروه فعال
              </span>
            </div>

            {groups.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-xs font-bold">هیچ گروهی تعریف نشده است.</p>
                <p className="text-[10px] text-slate-400 mt-1">از فرم مقابل برای ساخت اولین گروه استفاده کنید.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                {groups.map((group) => {
                  const membersCount = getGroupMembersCount(group.id);
                  const isPendingDelete = deletingGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className={`p-4 flex items-center justify-between gap-4 transition-all ${
                        isPendingDelete ? "bg-rose-50/30" : "hover:bg-slate-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black border shrink-0 ${getColorClasses(group.color || "indigo")}`}>
                          {group.name}
                        </span>
                        <div className="min-w-0">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                            {membersCount} عضو فعال
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isPendingDelete ? (
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-rose-100 shadow-sm">
                            <span className="text-[10px] font-bold text-rose-700 px-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              آیا مطمئنید؟
                            </span>
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                            >
                              بله، حذف کن
                            </button>
                            <button
                              onClick={() => setDeletingGroupId(null)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                            >
                              خیر
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(group)}
                              className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-450 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                              title="ویرایش گروه"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingGroupId(group.id)}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-450 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="حذف گروه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
