import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, XCircle, Search, RefreshCw, Send } from "lucide-react";

export default function MessagingLogsView({ showNotification }: any) {
  // In a real app, fetch these from messageLogs table
  const [logs, setLogs] = useState([
    {
      id: "log-1",
      recipient: "09123456789",
      content: "مشتری گرامی، فاکتور شما به شماره 1234 صادر شد.",
      status: "delivered",
      channelType: "sms_panel",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "log-2",
      recipient: "09198765432",
      content: "تاییدیه ورود به سیستم. کد: 5678",
      status: "failed",
      error: "Timeout waiting for GSM response",
      channelType: "gsm",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "log-3",
      recipient: "09351112233",
      content: "یادآوری: قسط شما به مبلغ 5,000,000 فردا سررسید می‌شود.",
      status: "sent",
      channelType: "whatsapp",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleRetry = (log: any) => {
    if (showNotification) showNotification(`در حال تلاش مجدد برای ارسال به ${log.recipient}`, "success");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return "رسیده به گیرنده";
      case 'sent': return "ارسال شده";
      case 'failed': return "خطا در ارسال";
      default: return "در صف";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'delivered': return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'sent': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'failed': return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredLogs = logs.filter(log => 
    log.recipient.includes(searchTerm) || log.content.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">گزارشات ارسال پیام</h2>
          <p className="text-slate-500 text-sm mt-1">تاریخچه پیام‌های ارسال شده از طریق تمامی کانال‌ها</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="جستجو در شماره یا متن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-slate-600">
            <thead className="text-xs text-slate-700 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">گیرنده</th>
                <th className="px-6 py-4 font-bold">متن پیام</th>
                <th className="px-6 py-4 font-bold">کانال ارسال</th>
                <th className="px-6 py-4 font-bold">زمان</th>
                <th className="px-6 py-4 font-bold">وضعیت</th>
                <th className="px-6 py-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono dir-ltr text-left font-bold text-slate-700">
                    {log.recipient}
                  </td>
                  <td className="px-6 py-4 min-w-[250px] max-w-[400px]">
                    <div className="truncate" title={log.content}>{log.content}</div>
                    {log.error && (
                      <div className="text-xs text-rose-500 mt-1 truncate" title={log.error}>
                        خطا: {log.error}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-mono">
                      {log.channelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs dir-ltr text-left text-slate-500">
                    {new Date(log.createdAt).toLocaleString('fa-IR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getStatusClass(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {getStatusText(log.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {log.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(log)}
                        className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        title="تلاش مجدد"
                      >
                        <RefreshCw className="w-4 h-4" />
                        تلاش مجدد
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    هیچ گزارشی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
