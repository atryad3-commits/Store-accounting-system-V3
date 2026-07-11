import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Palette,
  Check,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import {
  getPersonRoles,
  addPersonRole,
  updatePersonRole,
  deletePersonRole,
  getPersons,
  updatePerson,
} from "../../services/dataService";
import { Person, PersonRole } from "../../types";

interface PersonRolesManagerProps {
  showNotification: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

const colorPresets = [
  { value: "bg-emerald-50 text-emerald-800 border-emerald-150", label: "سبز زمردی", dot: "bg-emerald-500" },
  { value: "bg-orange-50 text-orange-850 border-orange-150", label: "نارنجی", dot: "bg-orange-500" },
  { value: "bg-purple-50 text-purple-800 border-purple-150", label: "بنفش", dot: "bg-purple-500" },
  { value: "bg-indigo-50 text-indigo-800 border-indigo-150", label: "آبی نیلی", dot: "bg-indigo-500" },
  { value: "bg-rose-50 text-rose-800 border-rose-150", label: "قرمز سرخ", dot: "bg-rose-500" },
  { value: "bg-amber-50 text-amber-800 border-amber-150", label: "زرد کهربایی", dot: "bg-amber-500" },
  { value: "bg-cyan-50 text-cyan-800 border-cyan-150", label: "فیروزه‌ای", dot: "bg-cyan-500" },
  { value: "bg-slate-50 text-slate-800 border-slate-150", label: "خاکستری", dot: "bg-slate-500" },
];

export default function PersonRolesManager({ showNotification }: PersonRolesManagerProps) {
  const [roles, setRoles] = useState<PersonRole[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleColor, setRoleColor] = useState("bg-indigo-50 text-indigo-800 border-indigo-150");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedRoles = await getPersonRoles();
      const fetchedPersons = await getPersons();
      setRoles(fetchedRoles || []);
      setPersons(fetchedPersons || []);
    } catch (error) {
      console.error("Error loading roles data", error);
      showNotification("خطا در بارگذاری اطلاعات نقش‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      showNotification("لطفاً نام نقش را وارد کنید", "error");
      return;
    }
    if (!roleCode.trim()) {
      showNotification("لطفاً کد معین نقش را وارد کنید", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingRoleId) {
        await updatePersonRole(editingRoleId, {
          name: roleName.trim(),
          code: roleCode.trim(),
          color: roleColor,
        });
        showNotification("نقش با موفقیت ویرایش شد", "success");
      } else {
        // Simple check for duplicate role ID or code
        const isDuplicate = roles.some((r) => r.id === roleName.trim() || r.code === roleCode.trim());
        if (isDuplicate) {
          showNotification("نقش یا کد معین وارد شده از قبل وجود دارد", "warning");
          setSubmitting(false);
          return;
        }

        // Generate a simple key-safe ID from English characters or Random id
        const roleId = Math.random().toString(36).substring(2, 9);
        await addPersonRole({
          id: roleId,
          name: roleName.trim(),
          code: roleCode.trim(),
          color: roleColor,
        });
        showNotification("نقش جدید با موفقیت ایجاد شد", "success");
      }

      // Reset Form
      setRoleName("");
      setRoleCode("");
      setRoleColor("bg-indigo-50 text-indigo-800 border-indigo-150");
      setEditingRoleId(null);
      await loadData();
    } catch (error) {
      console.error("Error saving role", error);
      showNotification("خطا در ذخیره‌سازی نقش", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setRoleName("");
    setRoleCode("");
    setRoleColor("bg-indigo-50 text-indigo-800 border-indigo-150");
  };

  const handleStartEdit = (role: PersonRole) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleCode(role.code || "");
    setRoleColor(role.color || "bg-indigo-50 text-indigo-800 border-indigo-150");
  };

  const handleDelete = async (id: string) => {
    // Prevent deleting default roles unless really desired, but let's allow it with precautions
    const isDefaultRole = ["customer", "supplier", "employee"].includes(id);
    
    try {
      await deletePersonRole(id);

      // Reset roles for persons affected
      const affectedPersons = (persons || []).filter((p) => p.role === id);
      let updatedCount = 0;
      for (const p of affectedPersons) {
        if (p.id) {
          await updatePerson(p.id as string, { ...p, role: "customer" }); // Fallback to customer
          updatedCount++;
        }
      }

      showNotification(
        `نقش با موفقیت حذف شد. ${updatedCount > 0 ? `${updatedCount} شخص به نقش پیش‌فرض (مشتری) منتقل شدند.` : ""}`,
        "success"
      );
      setDeletingRoleId(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting role", error);
      showNotification("خطا در حذف نقش", "error");
    }
  };

  const getRoleMembersCount = (roleId: string) => {
    return (persons || []).filter((p) => p.role === roleId).length;
  };

  return (
    <div className="font-sans" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Shield className="w-5 h-5" />
            </span>
            مدیریت نقش‌های اشخاص
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تعیین نقش‌های کاربری، تخصیص کدهای معین حسابداری و ویرایش قالب‌های رنگی نقش‌ها
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

      {loading && roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <Shield className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-500 mt-4">در حال دریافت اطلاعات نقش‌ها...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Add / Edit Form Panel */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <span className="p-1.5 rounded-lg bg-indigo-50/50 text-indigo-500">
                <ShieldAlert className="w-4 h-4" />
              </span>
              {editingRoleId ? "ویرایش نقش" : "ایجاد نقش جدید"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">عنوان نقش</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="مثال: بازاریاب، نماینده علمی، کارمند و..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">کد معین حسابداری</label>
                <input
                  type="text"
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                  placeholder="مثال: 103، 201 و..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  کدینگ معین حسابداری برای صدور خودکار اسناد مالی اشخاص با این نقش استفاده می‌شود.
                </p>
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
                      onClick={() => setRoleColor(preset.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all relative cursor-pointer ${
                        roleColor === preset.value
                          ? `${preset.value} border-2 border-indigo-600 scale-[1.03] shadow-sm`
                          : "bg-white text-slate-500 border-slate-150 hover:border-slate-300"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${preset.dot} mb-1`} />
                      {preset.label}
                      {roleColor === preset.value && (
                        <span className="absolute top-1 left-1 bg-indigo-600 text-white rounded-full p-0.5">
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Badge */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">پیش‌نمایش نقش</label>
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${roleColor}`}>
                    {roleName || "عنوان نقش"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">کد: {roleCode || "---"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/15 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {editingRoleId ? "اعمال تغییرات" : "ثبت و ذخیره"}
                </button>
                {editingRoleId && (
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

          {/* Roles List Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Shield className="w-4 h-4" />
                </span>
                لیست نقش‌های تعریف‌شده
              </h2>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                {roles.length} نقش فعال
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
              {roles.map((role) => {
                const membersCount = getRoleMembersCount(role.id);
                const isPendingDelete = deletingRoleId === role.id;
                const isDefaultRole = ["customer", "supplier", "employee"].includes(role.id);

                return (
                  <div
                    key={role.id}
                    className={`p-4 flex items-center justify-between gap-4 transition-all ${
                      isPendingDelete ? "bg-rose-50/30" : "hover:bg-slate-50/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black border shrink-0 ${role.color || "bg-indigo-50 text-indigo-800 border-indigo-150"}`}>
                        {role.name}
                      </span>
                      <div className="min-w-0 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold">
                          کد معین: <strong className="font-mono text-slate-700">{role.code || "---"}</strong>
                        </span>
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[9px] font-black">
                          {membersCount} عضو فعال
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPendingDelete ? (
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-rose-100 shadow-sm">
                          <span className="text-[10px] font-bold text-rose-700 px-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            حذف قطعی شود؟
                          </span>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                          >
                            بله
                          </button>
                          <button
                            onClick={() => setDeletingRoleId(null)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                          >
                            خیر
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(role)}
                            className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-450 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="ویرایش نقش"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isDefaultRole && (
                            <button
                              onClick={() => setDeletingRoleId(role.id)}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-450 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="حذف نقش"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
