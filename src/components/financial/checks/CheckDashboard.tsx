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

import { CashFlowForecast } from './CashFlowForecast';
export function CheckDashboard({ totalIssuedAmount, cashedIssuedAmount, pendingIssuedAmount, bouncedIssuedAmount, totalReceivedAmount, cashedReceivedAmount, inHandReceivedAmount, bouncedReceivedAmount }) {
  return (
    <>
/* SUBTAB 5: CHECK CHARTS */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Issued Checks Chart */}
              <div className="bg-white border text-right border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 self-start w-full border-b pb-3 mb-6 flex items-center justify-between">
                  نمودار وضعیت چک‌های صادره (پرداختی)
                  <span className="text-xs text-gray-500 font-normal">کل: {totalIssuedAmount.toLocaleString()} تومان</span>
                </h3>
                {totalIssuedAmount > 0 ? (
                  <div className="w-full flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'پاس شده', value: cashedIssuedAmount, color: '#34d399' },
                            { name: 'در جریان (پرداختی)', value: pendingIssuedAmount, color: '#9ca3af' },
                            { name: 'برگشتی', value: bouncedIssuedAmount, color: '#fb7185' }
                          ].filter(d => d.value > 0)}
                          cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                          paddingAngle={3} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[
                            { name: 'پاس شده', value: cashedIssuedAmount, color: '#34d399' },
                            { name: 'در جریان (پرداختی)', value: pendingIssuedAmount, color: '#9ca3af' },
                            { name: 'برگشتی', value: bouncedIssuedAmount, color: '#fb7185' }
                          ].filter(d => d.value > 0).map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [val.toLocaleString() + ' تومان', 'مبلغ']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                   <div className="flex-1 flex w-full items-center justify-center min-h-[300px] text-gray-400 font-medium text-sm">آماری جهت نمایش در دسترس نیست</div>
                )}
              </div>

              {/* Received Checks Chart */}
              <div className="bg-white border text-right border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 self-start w-full border-b pb-3 mb-6 flex items-center justify-between">
                  نمودار وضعیت چک‌های دریافتی (وصولی)
                  <span className="text-xs text-gray-500 font-normal">کل: {totalReceivedAmount.toLocaleString()} تومان</span>
                </h3>
                {totalReceivedAmount > 0 ? (
                  <div className="w-full flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'وصول شده', value: cashedReceivedAmount, color: '#10b981' },
                            { name: 'در جریان (وصولی)', value: inHandReceivedAmount, color: '#a78bfa' },
                            { name: 'برگشتی', value: bouncedReceivedAmount, color: '#f43f5e' }
                          ].filter(d => d.value > 0)}
                          cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                          paddingAngle={3} dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[
                             { name: 'وصول شده', value: cashedReceivedAmount, color: '#10b981' },
                             { name: 'در جریان (وصولی)', value: inHandReceivedAmount, color: '#a78bfa' },
                             { name: 'برگشتی', value: bouncedReceivedAmount, color: '#f43f5e' }
                          ].filter(d => d.value > 0).map((entry, idx) => (
                            <Cell key={`cell-rec-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [val.toLocaleString() + ' تومان', 'مبلغ']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex-1 flex w-full items-center justify-center min-h-[300px] text-gray-400 font-medium text-sm">آماری جهت نمایش در دسترس نیست</div>
                )}
              </div>
            </div>
          <CashFlowForecast />
          </div>
          </>
  );
}
