import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Users, Phone, MessageSquare } from "lucide-react";

export default function SendMessageView({ persons, showNotification }: any) {
  const [recipient, setRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const [channelType, setChannelType] = useState<any>("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !messageText) {
      if (showNotification) showNotification("گیرنده و متن پیام الزامی است", "error");
      return;
    }

    setIsSending(true);
    try {
      // In a real app, this would call an API endpoint that invokes MessagingManager
      // Since this is client-side, we simulate or call a local handler
      // await sendApiRequest(...)
      
      setTimeout(() => {
        setIsSending(false);
        setMessageText("");
        if (showNotification) showNotification("پیام با موفقیت در صف ارسال قرار گرفت", "success");
      }, 1000);
    } catch (error: any) {
      setIsSending(false);
      if (showNotification) showNotification(error.message || "خطا در ارسال پیام", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">ارسال پیام جدید</h2>
            <p className="text-indigo-100 text-sm">ارسال پیامک، واتساپ یا تلگرام به مخاطبین سیستم</p>
          </div>
          <MessageSquare className="w-48 h-48 absolute -right-8 -bottom-12 text-white opacity-10 rotate-12" />
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  شماره موبایل یا گیرنده
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="مثال: 09123456789"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 dir-ltr text-left"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  مسیر ارسال (اختیاری)
                </label>
                <select
                  value={channelType}
                  onChange={(e) => setChannelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3"
                >
                  <option value="">انتخاب خودکار (بر اساس اولویت)</option>
                  <option value="sms_panel">پنل پیامکی اینترنتی</option>
                  <option value="gsm">مودم GSM</option>
                  <option value="whatsapp">واتساپ</option>
                  <option value="telegram">تلگرام</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">متن پیام</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                placeholder="متن پیام خود را اینجا بنویسید..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 resize-none"
              ></textarea>
              <div className="text-xs text-slate-500 text-left" dir="ltr">
                {messageText.length} / 160 chars
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
              >
                {isSending ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                ارسال پیام
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
