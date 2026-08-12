import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { useChecks } from './checks/useChecks';
import { useCheckFilters } from './checks/useCheckFilters';
import { useCheckForm } from './checks/useCheckForm';
import { CheckDashboard } from './checks/CheckDashboard';
import { CheckNotifications } from './checks/CheckNotifications';
import { IssuedChecksList } from './checks/IssuedChecksList';
import { PendingCheckApprovals } from './checks/PendingCheckApprovals';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { ReceivedChecksList } from './checks/ReceivedChecksList';
import { CheckCalendar } from './checks/CheckCalendar';
import { CheckModals } from './checks/CheckModals';
import CheckbooksManager from './CheckbooksManager';
import { BarChart as BarChartIcon, BookOpen, Send, ArrowDownLeft, Calendar } from 'lucide-react';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import { formatDateDisplay } from '../../utils/format';

export default function CheckManagement({ showNotification, activeTab = 'checkbooks', onDataChange, currentUser = 'کاربر سیستم', sendNotification, storeSettings, setViewingCheck, onEditReceiptByCheck }: { showNotification?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void, activeTab?: 'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel', onDataChange?: () => void, currentUser?: string, sendNotification?: any, storeSettings?: any, setViewingCheck?: any, onEditReceiptByCheck?: any }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const notify = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (showNotification) {
      showNotification(msg, type);
    } else {
      showNotification(msg, 'error');
    }
  };

  const [activeSubTab, setActiveSubTab] = React.useState<'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel'>(
    (activeTab === 'check_panel' || !activeTab) ? 'check_charts' : activeTab as any
  );

  React.useEffect(() => {
    if (activeTab && activeTab !== 'check_panel') setActiveSubTab(activeTab as any);
  }, [activeTab]);

  const { checkbooks, setCheckbooks, issuedChecks, receivedChecks, accounts, persons, fetchData, rollbackCashedTransaction, deleteIssuedCheckHandler, deleteReceivedCheckHandler } = useChecks(onDataChange);

  const [issuedPage, setIssuedPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
  const pageSize = 20;

  const filters = useCheckFilters(issuedChecks, receivedChecks, persons, accounts, checkbooks);

  const { data: paginatedIssued } = useQuery({
    queryKey: ['issued_checks', issuedPage, pageSize, filters.issuedSortBy, filters.issuedSortDir],
    queryFn: async () => {
       const qs = new URLSearchParams({ page: String(issuedPage), pageSize: String(pageSize), sortBy: filters.issuedSortBy, sortDir: filters.issuedSortDir }).toString();
       const res = await fetch('/api/data/issued_checks?' + qs, {
          headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''), 'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
       });
       if (!res.ok) throw new Error('Error fetching issued checks');
       return res.json();
    },
  });

  const { data: paginatedReceived } = useQuery({
    queryKey: ['received_checks', receivedPage, pageSize, filters.receivedSortBy, filters.receivedSortDir],
    queryFn: async () => {
       const qs = new URLSearchParams({ page: String(receivedPage), pageSize: String(pageSize), sortBy: filters.receivedSortBy, sortDir: filters.receivedSortDir }).toString();
       const res = await fetch('/api/data/received_checks?' + qs, {
          headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''), 'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
       });
       if (!res.ok) throw new Error('Error fetching received checks');
       return res.json();
    },
  });

  const displayIssuedChecks = paginatedIssued?.data || filters.filteredIssuedChecks;
  const displayReceivedChecks = paginatedReceived?.data || filters.filteredReceivedChecks;

  const form = useCheckForm(issuedChecks, receivedChecks, fetchData, notify, currentUser, rollbackCashedTransaction);

  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<any[]>([new Date()]);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false);
  const [historyCheck, setHistoryCheck] = React.useState<any>(null);
  const [historyData, setHistoryData] = React.useState<any[]>([]);

  const toPersianDigits = (str: string | number | undefined | null) => {
    if (str === null || str === undefined) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/\d/g, x => persianDigits[parseInt(x, 10)]);
  };

  const getDaysRemaining = (dueDate: string) => {
    if (!dueDate) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let diff = 0;
      if (dueDate.includes('T')) {
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        diff = due.getTime() - today.getTime();
      } else {
        const todayObj = new DateObject({ calendar: persian }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const dueObj = new DateObject({ date: dueDate, format: "YYYY/MM/DD", calendar: persian }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        diff = dueObj.toDate().getTime() - todayObj.toDate().getTime();
      }
      return Math.floor(diff / (1000 * 3600 * 24));
    } catch(e) { return 0; }
  };

  const normalizeDate = (dStr: string) => {
    if (!dStr) return 0;
    if (dStr.includes('T')) {
      const d = new Date(dStr);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }
    const englishDStr = dStr.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
    const parts = englishDStr.split(/[/-]/).map(p => p.padStart(2, '0'));
    if (parts.length === 3) return parseInt(parts[0] + parts[1] + parts[2], 10);
    return 0;
  };

  const getSelectedRange = () => {
    if (!selectedCalendarDate || selectedCalendarDate.length === 0) return { start: 0, end: 0 };
    if (selectedCalendarDate.length === 1) {
      const s = normalizeDate(selectedCalendarDate[0]?.format ? selectedCalendarDate[0].format('YYYY/MM/DD') : new Date(selectedCalendarDate[0]).toLocaleDateString('fa-IR'));
      return { start: s, end: s };
    }
    const start = normalizeDate(selectedCalendarDate[0]?.format ? selectedCalendarDate[0].format('YYYY/MM/DD') : new Date(selectedCalendarDate[0]).toLocaleDateString('fa-IR'));
    const end = normalizeDate(selectedCalendarDate[1]?.format ? selectedCalendarDate[1].format('YYYY/MM/DD') : new Date(selectedCalendarDate[1]).toLocaleDateString('fa-IR'));
    return { start: Math.min(start, end), end: Math.max(start, end) };
  };

  const getCheckAuditLogs = async (id: string | number, type: 'issued' | 'received') => {
    const { getCheckAuditLogs: apiGetCheckHistory } = await import('../../services/dataService');
    const hist = await apiGetCheckHistory(id, type);
    setHistoryData(hist);
    setHistoryCheck(type === 'issued' ? issuedChecks.find(c => c.id === id) : receivedChecks.find(c => c.id === id));
    setIsHistoryModalOpen(true);
  };


  // Issued check totals
  const totalIssuedAmount = useMemo(() => {
    return (issuedChecks || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [issuedChecks]);

  const cashedIssuedAmount = useMemo(() => {
    return (issuedChecks || []).filter(c => c.status === 'cashed').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [issuedChecks]);

  const pendingIssuedAmount = useMemo(() => {
    return (issuedChecks || []).filter(c => c.status === 'issued' || c.status === 'blank').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [issuedChecks]);

  const bouncedIssuedAmount = useMemo(() => {
    return (issuedChecks || []).filter(c => c.status === 'bounced').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [issuedChecks]);

  // Received check totals
  const totalReceivedAmount = useMemo(() => {
    return (receivedChecks || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [receivedChecks]);

  const cashedReceivedAmount = useMemo(() => {
    return (receivedChecks || []).filter(c => c.status === 'cashed').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [receivedChecks]);

  const inHandReceivedAmount = useMemo(() => {
    return (receivedChecks || []).filter(c => c.status === 'received' || c.status === 'deposited').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [receivedChecks]);

  const bouncedReceivedAmount = useMemo(() => {
    return (receivedChecks || []).filter(c => c.status === 'bounced' || c.status === 'bounced_assigned').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [receivedChecks]);


  return (
    <div className="bg-slate-50 min-h-screen p-4 pb-24 md:p-6 text-right" dir="rtl">
      {/* Header and navigation removed for brevity, it's just tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              مدیریت یکپارچه چک و بانک
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {activeSubTab === 'checkbooks' ? 'تعریف و نظارت بر دسته‌چک‌های بانکی اختصاصی' : activeSubTab === 'issued_checks' ? 'نظارت بر وضعیت برگه‌های چک پرداخت شده به حساب مشتریان و تامین‌کنندگان' : activeSubTab === 'check_calendar' ? 'نظارت تصویری بر تاریخ‌های سررسید چک‌ها بوسیله تقویم ماهانه' : activeSubTab === 'check_charts' ? 'گزارش‌گیری و نمایش بصری وضعیت و گردش چک‌های پرداختی و دریافتی' : 'مدیریت وضعیت وصول و اقلام چک‌های دریافت شده از اشخاص'}
            </p>
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex overflow-x-auto gap-2 mb-6 custom-scrollbar print:hidden">
          {[
            { id: 'check_charts', label: 'داشبورد', icon: <BarChartIcon className="w-4 h-4" /> },
            { id: 'checkbooks', label: 'دسته‌چک‌ها', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'issued_checks', label: 'چک‌های پرداختی', icon: <Send className="w-4 h-4" /> },
            { id: 'received_checks', label: 'چک‌های دریافتی', icon: <ArrowDownLeft className="w-4 h-4" /> },
            { id: 'check_calendar', label: 'تقویم سررسید', icon: <Calendar className="w-4 h-4" /> },
            { id: 'pending_approvals', label: 'در انتظار تأیید', icon: <ShieldCheck className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeSubTab === tab.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* SUBTABS */}
        <div className="print:m-0 print:p-0">
          <CheckNotifications 
            issuedChecks={issuedChecks} 
            receivedChecks={receivedChecks} 
            formatCurrency={(v) => Number(v).toLocaleString()}
          />
          {activeSubTab === 'checkbooks' && <CheckbooksManager showNotification={showNotification} />}
          {activeSubTab === 'issued_checks' && (
            <IssuedChecksList 
              showNotification={notify} onEditReceiptByCheck={onEditReceiptByCheck}
              issuedChecks={issuedChecks} persons={persons} checkbooks={checkbooks} accounts={accounts}
              issuedSearchQuery={filters.issuedSearchQuery} setIssuedSearchQuery={filters.setIssuedSearchQuery}
              issuedCheckStatusFilter={filters.issuedCheckStatusFilter} setIssuedCheckStatusFilter={filters.setIssuedCheckStatusFilter}
              issuedCheckbookFilter={filters.issuedCheckbookFilter} setIssuedCheckbookFilter={filters.setIssuedCheckbookFilter}
              issuedSortBy={filters.issuedSortBy} setIssuedSortBy={filters.setIssuedSortBy}
              issuedSortDir={filters.issuedSortDir} setIssuedSortDir={filters.setIssuedSortDir}
              filteredIssuedChecks={displayIssuedChecks} issuedPage={issuedPage} setIssuedPage={setIssuedPage} totalIssuedPages={paginatedIssued?.totalCount ? Math.ceil(paginatedIssued.totalCount / pageSize) : 1}
              totalIssuedAmount={totalIssuedAmount} cashedIssuedAmount={cashedIssuedAmount}
              pendingIssuedAmount={pendingIssuedAmount} bouncedIssuedAmount={bouncedIssuedAmount}
              setViewingCheck={setViewingCheck}
              setUpdatingCheckId={form.setUpdatingCheckId} setUpdatingCheckType={form.setUpdatingCheckType}
              setStatusVal={form.setStatusVal} setIsStatusModalOpen={form.setIsStatusModalOpen}
              setIsHistoryModalOpen={setIsHistoryModalOpen} setHistoryCheck={setHistoryCheck}
              setHistoryData={setHistoryData} handleDeleteIssuedCheck={deleteIssuedCheckHandler}
              formatDateDisplay={formatDateDisplay} storeSettings={storeSettings}
              sendNotification={sendNotification} getCheckAuditLogs={getCheckAuditLogs}
            />
          )}
          {activeSubTab === 'received_checks' && (
            <ReceivedChecksList 
              showNotification={notify}
              receivedChecks={receivedChecks} persons={persons} checkbooks={checkbooks} accounts={accounts}
              receivedSearchQuery={filters.receivedSearchQuery} setReceivedSearchQuery={filters.setReceivedSearchQuery}
              receivedCheckStatusFilter={filters.receivedCheckStatusFilter} setReceivedCheckStatusFilter={filters.setReceivedCheckStatusFilter}
              receivedSortBy={filters.receivedSortBy} setReceivedSortBy={filters.setReceivedSortBy}
              receivedSortDir={filters.receivedSortDir} setReceivedSortDir={filters.setReceivedSortDir}
              filteredReceivedChecks={displayReceivedChecks} receivedPage={receivedPage} setReceivedPage={setReceivedPage} totalReceivedPages={paginatedReceived?.totalCount ? Math.ceil(paginatedReceived.totalCount / pageSize) : 1}
              totalReceivedAmount={totalReceivedAmount} cashedReceivedAmount={cashedReceivedAmount}
              inHandReceivedAmount={inHandReceivedAmount} bouncedReceivedAmount={bouncedReceivedAmount}
              setViewingCheck={setViewingCheck}
              setUpdatingCheckId={form.setUpdatingCheckId} setUpdatingCheckType={form.setUpdatingCheckType}
              setStatusVal={form.setStatusVal} setIsStatusModalOpen={form.setIsStatusModalOpen}
              setIsHistoryModalOpen={setIsHistoryModalOpen} setHistoryCheck={setHistoryCheck}
              setHistoryData={setHistoryData} handleDeleteReceivedCheck={deleteReceivedCheckHandler}
              formatDateDisplay={formatDateDisplay} storeSettings={storeSettings}
              sendNotification={sendNotification} getCheckAuditLogs={getCheckAuditLogs} onEditReceiptByCheck={onEditReceiptByCheck}
            />
          )}
          {activeSubTab === ('pending_approvals' as any) && (
          <PendingCheckApprovals
            issuedChecks={issuedChecks}
            receivedChecks={receivedChecks}
            persons={persons}
            accounts={accounts}
            checkbooks={checkbooks}
            showNotification={notify}
            userRole={user?.role}
            currentUserId={user?.id || user?.username}
            onCheckUpdated={() => { fetchData(); queryClient.invalidateQueries({ queryKey: ['issued_checks'] }); queryClient.invalidateQueries({ queryKey: ['received_checks'] }); }}
          />
        )}
        {activeSubTab === 'check_calendar' && (
            <CheckCalendar storeSettings={storeSettings} 
              issuedChecks={issuedChecks} receivedChecks={receivedChecks} persons={persons} checkbooks={checkbooks} accounts={accounts}
              selectedCalendarDate={selectedCalendarDate} setSelectedCalendarDate={setSelectedCalendarDate}
              normalizeDate={normalizeDate} getSelectedRange={getSelectedRange} setViewingCheck={setViewingCheck}
            />
          )}
          {activeSubTab === 'check_charts' && (
            <CheckDashboard 
              totalIssuedAmount={totalIssuedAmount} cashedIssuedAmount={cashedIssuedAmount}
              pendingIssuedAmount={pendingIssuedAmount} bouncedIssuedAmount={bouncedIssuedAmount}
              totalReceivedAmount={totalReceivedAmount} cashedReceivedAmount={cashedReceivedAmount}
              inHandReceivedAmount={inHandReceivedAmount} bouncedReceivedAmount={bouncedReceivedAmount}
              issuedChecks={issuedChecks}
              receivedChecks={receivedChecks}
              accounts={accounts}
            />
          )}
        </div>
      </div>
      <CheckModals issuedChecks={issuedChecks} 
        showNotification={notify}
        receivedChecks={receivedChecks}
        setHistoryCheck={setHistoryCheck}
        {...form}
        isHistoryModalOpen={isHistoryModalOpen} setIsHistoryModalOpen={setIsHistoryModalOpen}
        historyCheck={historyCheck} historyData={historyData}
        persons={persons} checkbooks={checkbooks} accounts={accounts}
        formatDateDisplay={formatDateDisplay} storeSettings={storeSettings} toPersianDigits={toPersianDigits}
      />
    </div>
  );
}
