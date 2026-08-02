import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Settings, Check, X, Server, Radio, Smartphone, Edit2, AlertCircle } from "lucide-react";

export default function MessagingChannelsView({ showNotification }: any) {
  // In a real app, fetch these from DB (messageChannels table)
  const [channels, setChannels] = useState([
    {
      id: "ch-1",
      name: "پنل پیامک وب‌سرویس",
      type: "sms_panel",
      priority: 1,
      isEnabled: true,
      config: { endpoint: "http://api.sms-webservice.com/api/V3/", apiKey: "", senderNumber: "" }
    },
    {
      id: "ch-2",
      name: "مودم GSM فیزیکی",
      type: "gsm",
      priority: 2,
      isEnabled: false,
      config: { portPath: "/dev/ttyUSB0", baudRate: 9600 }
    },
    {
      id: "ch-3",
      name: "واتساپ بیزینس",
      type: "whatsapp",
      priority: 3,
      isEnabled: false,
      config: { accessToken: "", phoneNumberId: "" }
    },
    {
      id: "ch-4",
      name: "ربات تلگرام",
      type: "telegram",
      priority: 4,
      isEnabled: false,
      config: { botToken: "" }
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const handleEdit = (channel: any) => {
    setEditingId(channel.id);
    setEditForm(JSON.parse(JSON.stringify(channel)));
  };

  const handleSave = () => {
    setChannels(channels.map(ch => ch.id === editForm.id ? editForm : ch));
    setEditingId(null);
    if (showNotification) showNotification("تنظیمات کانال با موفقیت ذخیره شد", "success");
    // In real app, make API call to save to DB
  };

  const toggleStatus = (id: string) => {
    setChannels(channels.map(ch => {
      if (ch.id === id) return { ...ch, isEnabled: !ch.isEnabled };
      return ch;
    }));
    if (showNotification) showNotification("وضعیت کانال تغییر کرد", "success");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'sms_panel': return <Server className="w-5 h-5" />;
      case 'gsm': return <Radio className="w-5 h-5" />;
      case 'whatsapp': return <Smartphone className="w-5 h-5" />;
      case 'telegram': return <MessageSquare className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };
  
  // Need to import MessageSquare inside the component or outside? Let's just use Settings for telegram if missing
  const getIconFixed = (type: string) => {
    switch (type) {
      case 'sms_panel': return <Server className="w-5 h-5" />;
      case 'gsm': return <Radio className="w-5 h-5" />;
      case 'whatsapp': return <Smartphone className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت کانال‌های ارسال</h2>
          <p className="text-slate-500 text-sm mt-1">پیکربندی و اولویت‌بندی درگاه‌های پیامکی و پیام‌رسان‌ها</p>
        </div>
      </div>

      {editingId ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              ویرایش تنظیمات: {editForm.name}
            </h3>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">نام کانال</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">اولویت (عدد کوچکتر = اولویت بالاتر)</label>
              <input
                type="number"
                value={editForm.priority}
                onChange={e => setEditForm({...editForm, priority: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 space-y-4 mb-6 border border-slate-100">
            <h4 className="font-bold text-sm text-slate-700 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-500" />
              پارامترهای اتصال
            </h4>
            
            {Object.keys(editForm.config).map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-bold text-slate-600">{key}</label>
                <input
                  type="text"
                  value={editForm.config[key]}
                  onChange={e => setEditForm({
                    ...editForm,
                    config: { ...editForm.config, [key]: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2 dir-ltr text-left"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditingId(null)}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              ذخیره تنظیمات
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.sort((a, b) => a.priority - b.priority).map((channel) => (
            <div key={channel.id} className={`bg-white rounded-2xl border ${channel.isEnabled ? 'border-indigo-100 shadow-md shadow-indigo-50' : 'border-slate-100 shadow-sm opacity-70'} overflow-hidden transition-all`}>
              <div className={`p-5 flex items-start justify-between border-b ${channel.isEnabled ? 'border-indigo-50 bg-indigo-50/30' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${channel.isEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                    {getIconFixed(channel.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{channel.name}</h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">{channel.type}</span>
                      <span>اولویت: {channel.priority}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => toggleStatus(channel.id)}>
                  <div className={`w-11 h-6 rounded-full transition-colors ${channel.isEnabled ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform top-1 left-1 ${channel.isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
              
              <div className="p-4 bg-white flex justify-between items-center">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {channel.isEnabled ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-500" /> فعال و آماده به کار</>
                  ) : (
                    <><AlertCircle className="w-3.5 h-3.5 text-slate-400" /> غیرفعال</>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(channel)}
                  className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  تنظیمات
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
