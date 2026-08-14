import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  CreditCard, Plus, Edit2, Trash2, CheckCircle, Clock, X, Save, 
  ArrowDownLeft, BookOpen, ArrowUpRight, Calendar, Building2, HelpCircle, AlertTriangle, Search, TrendingUp, DollarSign, Percent, BarChart as BarChartIcon, ChevronDown, Printer, History, Activity, User, Send
, ArrowLeft} from 'lucide-react';
import DatePickerModule, { Calendar as RMCalendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export function CheckCalendar({ storeSettings, issuedChecks, receivedChecks, persons, checkbooks, accounts, selectedCalendarDate, setSelectedCalendarDate, normalizeDate, getSelectedRange, setViewingCheck }) {
  return (
    <>
/* SUBTAB 4: CHECK CALENDAR */
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col items-center">
                <RMCalendar
                  range
                  calendar={storeSettings?.calendarType === 'gregorian' ? undefined : persian}
                  locale={storeSettings?.calendarType === 'gregorian' ? undefined : persian_fa}
                  value={selectedCalendarDate}
                  onChange={(dates: any) => setSelectedCalendarDate(dates || [])}
                  className="w-full !shadow-none !border-0"
                  mapDays={({ date }) => {
                    const dateStr = date.format('YYYY/MM/DD');
                    const hasIssued = issuedChecks.some(c => normalizeDate(c.dueDate) === normalizeDate(dateStr));
                    const hasReceived = receivedChecks.some(c => normalizeDate(c.dueDate) === normalizeDate(dateStr));
                    
                    if (hasIssued && hasReceived) return { className: "bg-indigo-100 text-indigo-800 font-bold border border-indigo-300" };
                    if (hasIssued) return { className: "bg-rose-50 text-rose-700 font-bold border border-rose-200" };
                    if (hasReceived) return { className: "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200" };
                    return {};
                  }}
                />
                
                <div className="mt-6 w-full space-y-2 border-t pt-4">
                  <h4 className="text-xs font-bold text-gray-400 mb-3 text-right">راهنمای رنگ‌ها</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300 inline-block"></span>
                    دارای چک دریافتی (وصولی)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300 inline-block"></span>
                    دارای چک پرداختی (صادره)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-300 inline-block"></span>
                    دارای هر دو نوع چک
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-black text-gray-800">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  برنامه‌ریزی چک‌ها برای تاریخ: <span className="font-mono text-indigo-700">
                    {(() => {
                      const range = getSelectedRange();
                      if (range.start === 0) return 'بازه انتخاب نشده';
                      const startStr = String(range.start).replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
                      const endStr = String(range.end).replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
                      return startStr === endStr ? startStr : `از ${startStr} تا ${endStr}`;
                    })()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Received Checks for selected date */}
                <div className="bg-white border text-right border-emerald-100 rounded-2xl overflow-hidden">
                  <div className="bg-emerald-50 text-emerald-900 border-b border-emerald-100 px-4 py-3 font-bold text-sm flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    چک‌های دریافتی روز
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {(receivedChecks || []).filter(c => {
                       const cDate = normalizeDate(c.dueDate);
                       const range = getSelectedRange();
                       if (range.start === 0) return false;
                       return cDate >= range.start && cDate <= range.end;
                    }).map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-xl p-3 shadow-xs hover:border-emerald-200 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span 
                            className="font-mono text-sm font-black text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline transition-colors decoration-dashed underline-offset-4"
                            onClick={() => setViewingCheck && setViewingCheck({ ...c, _type: 'received' })}
                            title="مشاهده جزئیات چک"
                          >
                            {c.checkNumber}
                          </span>
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                            c.status === 'cashed' ? 'bg-emerald-100 text-emerald-700' : 
                            c.status === 'bounced' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700' 
                          }`}>
                             {c.status === 'cashed' ? 'وصول شده' : c.status === 'bounced' ? 'برگشتی' : 'در جریان وصول'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-700 mb-2 truncate">
                           مشتری: {persons.find(p => p.id?.toString() === c.payerId?.toString())?.name || c.payerId}
                        </div>
                        <div className="text-xs text-gray-500 mb-3 flex justify-between">
                          <span className="truncate">بانک: {c.bankName}</span>
                          <span className="font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-600">{c.dueDate}</span>
                        </div>
                        <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-3">
                          <span className="text-xs text-emerald-600 font-bold">مبلغ :</span>
                          <span className="font-sans text-emerald-600 font-black text-sm">{Number(c.amount).toLocaleString()} <span className="text-[10px] text-gray-400">تومان</span></span>
                        </div>
                      </div>
                    ))}
                    {(receivedChecks || []).filter(c => {
                       const cDate = normalizeDate(c.dueDate);
                       const range = getSelectedRange();
                       if (range.start === 0) return false;
                       return cDate >= range.start && cDate <= range.end;
                    }).length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-xs font-medium">هیچ چک دریافتی در این بازه ثبت نشده است.</div>
                    )}
                  </div>
                </div>
                
                {/* Issued Checks for selected date */}
                <div className="bg-white border text-right border-rose-100 rounded-2xl overflow-hidden">
                  <div className="bg-rose-50 text-rose-900 border-b border-rose-100 px-4 py-3 font-bold text-sm flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    چک‌های پرداختی روز
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {(issuedChecks || []).filter(c => {
                       const cDate = normalizeDate(c.dueDate);
                       const range = getSelectedRange();
                       if (range.start === 0) return false;
                       return cDate >= range.start && cDate <= range.end;
                    }).map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-xl p-3 shadow-xs hover:border-rose-200 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span 
                            className="font-mono text-sm font-black text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline transition-colors decoration-dashed underline-offset-4"
                            onClick={() => setViewingCheck && setViewingCheck({ ...c, _type: 'issued' })}
                            title="مشاهده جزئیات چک"
                          >
                            {c.checkNumber}
                          </span>
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                            c.status === 'cashed' ? 'bg-emerald-100 text-emerald-700' : 
                            c.status === 'bounced' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700' 
                          }`}>
                            {c.status === 'cashed' ? 'پاس شده' : c.status === 'bounced' ? 'برگشتی' : 'در جریان پرداخت'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-700 mb-2 truncate">
                           ذینفع: {persons.find(p => p.id?.toString() === c.payeeId?.toString())?.name || c.payeeId}
                        </div>
                        <div className="text-xs text-gray-500 mb-3 flex justify-between">
                          <span className="truncate">حساب: {accounts.find(a => a.id == checkbooks.find(x => x.id == c.checkbookId)?.accountId)?.bankName || 'نامشخص'}</span>
                          <span className="font-mono text-[10px] bg-rose-50 px-1.5 py-0.5 rounded text-rose-600">{c.dueDate}</span>
                        </div>
                        <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-3">
                          <span className="text-xs text-rose-600 font-bold">مبلغ :</span>
                          <span className="font-sans text-rose-600 font-black text-sm">{Number(c.amount).toLocaleString()} <span className="text-[10px] text-gray-400">تومان</span></span>
                        </div>
                      </div>
                    ))}
                    {(issuedChecks || []).filter(c => {
                       const cDate = normalizeDate(c.dueDate);
                       const range = getSelectedRange();
                       if (range.start === 0) return false;
                       return cDate >= range.start && cDate <= range.end;
                    }).length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-xs font-medium">هیچ چک پرداختی در این بازه ثبت نشده است.</div>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        ) : (
          
    </>
  );
}
