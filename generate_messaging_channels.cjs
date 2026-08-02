import React, { useState } from "react";
import { 
  Plus, Search, Trash2, Edit2, Key, CheckCircle, XCircle, MessageSquare, 
  Settings, X, Check, Server, Radio, Smartphone, AlertCircle, ChevronDown, 
  Activity, Clock, Crown, GripVertical, Copy, ArrowRight, ArrowLeft, Filter, RefreshCw,
  Mail, Bell, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "motion/react";

interface ChannelConfig {
  id: string;
  name: string;
  type: 'sms_panel' | 'gsm' | 'whatsapp' | 'telegram' | 'email' | 'push';
  isEnabled: boolean;
  priority: number;
  status: 'connected' | 'disconnected' | 'rate-limited';
  lastUsed: string;
  config: Record<string, string>;
  dailyRateLimit: number;
  activeHours: { start: string; end: string };
  defaultSenderId: string;
}

const mockChannels: ChannelConfig[] = [
  {
    id: "ch-1",
    name: "پنل پیامک کاوه نگار",
    type: "sms_panel",
    isEnabled: true,
    priority: 1,
    status: "connected",
    lastUsed: "2 دقیقه پیش",
    dailyRateLimit: 10000,
    activeHours: { start: "00:00", end: "23:59" },
    defaultSenderId: "10004346",
    config: {
      apiKey: "kaveh_5f4d8e8a9b...",
      lineNumber: "10004346",
    }
  },
  {
    id: "ch-2",
    name: "خط GSM دفتر",
    type: "gsm",
    isEnabled: true,
    priority: 2,
    status: "rate-limited",
    lastUsed: "1 ساعت پیش",
    dailyRateLimit: 500,
    activeHours: { start: "08:00", end: "18:00" },
    defaultSenderId: "09123456789",
    config: {
      port: "COM3",
      baudRate: "115200"
    }
  },
  {
    id: "ch-3",
    name: "واتس‌اپ تجاری",
    type: "whatsapp",
    isEnabled: false,
    priority: 3,
    status: "disconnected",
    lastUsed: "2 روز پیش",
    dailyRateLimit: 1000,
    activeHours: { start: "08:00", end: "22:00" },
    defaultSenderId: "BrandName",
    config: {
      instanceId: "wa_inst_8472",
      token: "wa_token_xxx",
    }
  },
  {
    id: "ch-4",
    name: "ربات تلگرام پشتیبانی",
    type: "telegram",
    isEnabled: true,
    priority: 4,
    status: "connected",
    lastUsed: "5 دقیقه پیش",
    dailyRateLimit: 5000,
    activeHours: { start: "00:00", end: "23:59" },
    defaultSenderId: "SupportBot",
    config: {
      botToken: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
    }
  }
];

const mockLogs = [
  { id: 1, time: '14:32:05', channel: 'پنل پیامک کاوه نگار', recipient: '0912***3456', status: 'success', error: null },
  { id: 2, time: '14:30:12', channel: 'خط GSM دفتر', recipient: '0935***7890', status: 'failed', error: 'No signal' },
  { id: 3, time: '14:28:45', channel: 'واتس‌اپ تجاری', recipient: '0912***1111', status: 'queued', error: null },
  { id: 4, time: '14:15:00', channel: 'ربات تلگرام پشتیبانی', recipient: '@user123', status: 'success', error: null },
  { id: 5, time: '13:45:22', channel: 'پنل پیامک کاوه نگار', recipient: '0912***9999', status: 'success', error: null },
];

export default function MessagingChannelsView({ showNotification }: { showNotification?: (msg: string, type: string) => void }) {
  const [channels, setChannels] = useState<ChannelConfig[]>(mockChannels.sort((a,b) => a.priority - b.priority));
  const [editingChannel, setEditingChannel] = useState<ChannelConfig | null>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Reorder logic
  const handleReorder = (newOrder: ChannelConfig[]) => {
    // Update priorities based on new order
    const updatedChannels = newOrder.map((ch, index) => ({
      ...ch,
      priority: index + 1
    }));
    setChannels(updatedChannels);
    if (showNotification) showNotification("اولویت کانال‌ها بروزرسانی شد", "success");
  };

  const getIconFixed = (type: string) => {
    switch (type) {
      case 'sms_panel': return <Server className="w-5 h-5" />;
      case 'gsm': return <Radio className="w-5 h-5" />;
      case 'whatsapp': return <Smartphone className="w-5 h-5" />;
      case 'telegram': return <MessageSquare className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'push': return <Bell className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const toggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChannels(channels.map(ch => {
      if (ch.id === id) return { ...ch, isEnabled: !ch.isEnabled };
      return ch;
    }));
    if (showNotification) showNotification("وضعیت کانال تغییر کرد", "success");
  };

  const handleSave = () => {
    if (editingChannel) {
      // Fake confirmation for critical changes
      if (confirm("آیا از ذخیره این تغییرات حیاتی اطمینان دارید؟ (نیاز به تایید مدیر)")) {
        setChannels(channels.map(ch => ch.id === editingChannel.id ? editingChannel : ch));
        setEditingChannel(null);
        if (showNotification) showNotification("تنظیمات کانال با موفقیت ذخیره شد", "success");
      }
    }
  };

  const testConnection = () => {
    if (showNotification) showNotification("در حال بررسی اتصال...", "info");
    setTimeout(() => {
      if (showNotification) showNotification("اتصال با موفقیت برقرار شد", "success");
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (showNotification) showNotification("در کلیپ‌بورد کپی شد", "success");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50 min-h-full">
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">کانال‌های فعال</p>
            <p className="text-2xl font-bold text-slate-800">{channels.filter(c => c.isEnabled).length} / {channels.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">موفقیت ۲۴ ساعت (٪)</p>
            <p className="text-2xl font-bold text-slate-800">98.4%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">متوسط تاخیر ارسال</p>
            <p className="text-2xl font-bold text-slate-800">1.2s</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">بهترین کانال امروز</p>
            <p className="text-lg font-bold text-slate-800 truncate">پنل پیامک کاوه نگار</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت کانال‌های ارسال</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span>پیکربندی، اولویت‌بندی و مانیتورینگ درگاه‌های پیامکی و پیام‌رسان‌ها</span>
          </p>
        </div>
        <button 
          onClick={() => setIsLogsOpen(!isLogsOpen)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          تاریخچه تراکنش‌ها (Logs)
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5" />
        <div>
          <h4 className="font-bold text-rose-800 text-sm">هشدار امنیتی: کلید API واتس‌اپ منقضی شده است</h4>
          <p className="text-rose-600 text-xs mt-1">جهت جلوگیری از اختلال در ارسال، لطفا کلید جدید را در تنظیمات وارد کنید.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Smart Failover Queue */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[500px]">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              صف هوشمند اولویت‌ها (Failover)
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              در صورت شکست در ارسال، سیستم به طور خودکار به کانال بعدی در صف سوییچ می‌کند. (برای تغییر اولویت کشیدن و رها کنید)
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <Reorder.Group axis="y" values={channels} onReorder={handleReorder} className="space-y-3">
              {channels.map((channel, index) => (
                <Reorder.Item 
                  key={channel.id} 
                  value={channel}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border ${
                    index === 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
                  } cursor-grab active:cursor-grabbing transition-colors group`}
                >
                  <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {getIconFixed(channel.type)}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-700 truncate">{channel.name}</span>
                      {index === 0 && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    </div>
                    <span className="text-xs text-slate-400">اولویت {index + 1}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${channel.isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>

        {/* Right Column: Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          {channels.map((channel) => (
            <div 
              key={channel.id} 
              onClick={() => setEditingChannel(channel)}
              className={`group bg-white rounded-2xl border ${channel.isEnabled ? 'border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200' : 'border-slate-100 opacity-80 hover:opacity-100 hover:border-slate-300'} p-5 cursor-pointer transition-all duration-300 relative overflow-hidden`}
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${
                channel.status === 'connected' ? 'bg-emerald-500' : 
                channel.status === 'rate-limited' ? 'bg-amber-500' : 'bg-rose-500'
              }`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    channel.isEnabled ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {getIconFixed(channel.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{channel.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        channel.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 
                        channel.status === 'rate-limited' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {channel.status === 'connected' ? 'متصل' : channel.status === 'rate-limited' ? 'محدودیت نرخ' : 'قطع ارتباط'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Sleek Toggle Switch */}
                <div 
                  className="relative inline-flex items-center"
                  onClick={(e) => toggleStatus(e, channel.id)}
                >
                  <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${channel.isEnabled ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                  <div className={`absolute w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 top-0.5 left-0.5 ${channel.isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-50">
                <div className="text-xs text-slate-500">
                  <span className="block mb-1">آخرین استفاده:</span>
                  <span className="font-medium text-slate-700">{channel.lastUsed}</span>
                </div>
                <div className="text-xs text-slate-500 text-left">
                  <span className="block mb-1">ظرفیت روزانه:</span>
                  <span className="font-medium text-slate-700">{channel.dailyRateLimit.toLocaleString()} پیام</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in Modal / Drawer for Advanced Configuration */}
      <AnimatePresence>
        {editingChannel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:justify-end sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setEditingChannel(null)}
            />
            
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full sm:h-screen sm:rounded-l-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    {getIconFixed(editingChannel.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">پیکربندی پیشرفته</h3>
                    <p className="text-xs text-slate-500">{editingChannel.name}</p>
                  </div>
                </div>
                <button onClick={() => setEditingChannel(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Auth & API Keys */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Key className="w-4 h-4 text-indigo-500" />
                    احراز هویت و API
                  </h4>
                  
                  {Object.keys(editingChannel.config).map((key) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 capitalize">{key}</label>
                      <div className="relative">
                        <input
                          type={key.toLowerCase().includes('key') || key.toLowerCase().includes('token') ? (showKey ? "text" : "password") : "text"}
                          value={editingChannel.config[key]}
                          onChange={e => setEditingChannel({
                            ...editingChannel,
                            config: { ...editingChannel.config, [key]: e.target.value }
                          })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 dir-ltr text-left pr-10"
                        />
                        {(key.toLowerCase().includes('key') || key.toLowerCase().includes('token')) && (
                          <button 
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600"
                          >
                            {showKey ? <AlertCircle className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(editingChannel.config[key])}
                          className="absolute left-3 top-3 text-slate-400 hover:text-indigo-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* General Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Settings className="w-4 h-4 text-indigo-500" />
                    تنظیمات عمومی
                  </h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">فرستنده پیش‌فرض (Sender ID / From)</label>
                    <input
                      type="text"
                      value={editingChannel.defaultSenderId}
                      onChange={e => setEditingChannel({...editingChannel, defaultSenderId: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">محدودیت ارسال روزانه (Daily Rate Limit)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="100"
                        value={editingChannel.dailyRateLimit}
                        onChange={e => setEditingChannel({...editingChannel, dailyRateLimit: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-sm font-bold text-indigo-600 w-16 text-left">
                        {editingChannel.dailyRateLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">ساعات مجاز فعالیت (Business Hours)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        value={editingChannel.activeHours.start}
                        onChange={e => setEditingChannel({
                          ...editingChannel, 
                          activeHours: {...editingChannel.activeHours, start: e.target.value}
                        })}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 p-2 flex-1 text-center"
                      />
                      <span className="text-slate-400">تا</span>
                      <input
                        type="time"
                        value={editingChannel.activeHours.end}
                        onChange={e => setEditingChannel({
                          ...editingChannel, 
                          activeHours: {...editingChannel.activeHours, end: e.target.value}
                        })}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 p-2 flex-1 text-center"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-4">
                  <button 
                    onClick={testConnection}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <Activity className="w-5 h-5" />
                    تست اتصال (Test Connection)
                  </button>
                  <button 
                    onClick={handleSave}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    ذخیره تغییرات
                  </button>
                </div>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Log & Audit Trail (Collapsible) */}
      <AnimatePresence>
        {isLogsOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  تاریخچه ارسال و لاگ‌ها (Transmission Logs)
                </h3>
                
                {/* Filter Chips */}
                <div className="hidden md:flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    امروز
                  </button>
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg">
                    موفق
                  </button>
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg">
                    خطا دار
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-slate-500">
                  <thead className="text-xs text-slate-700 bg-slate-50 uppercase rounded-xl overflow-hidden">
                    <tr>
                      <th className="px-4 py-3 rounded-tr-xl">زمان</th>
                      <th className="px-4 py-3">کانال ارتباطی</th>
                      <th className="px-4 py-3">گیرنده</th>
                      <th className="px-4 py-3">وضعیت</th>
                      <th className="px-4 py-3 rounded-tl-xl">خطا (در صورت وجود)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-600">{log.time}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{log.channel}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{log.recipient}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                            log.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {log.status === 'success' ? 'ارسال شده' : log.status === 'failed' ? 'خطا' : 'در صف ارسال'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-rose-500 text-xs font-medium">
                          {log.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
