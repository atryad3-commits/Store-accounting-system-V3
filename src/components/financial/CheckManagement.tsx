import CheckbooksManager from "./CheckbooksManager";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DatePickerModule, { Calendar as RMCalendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
const DatePicker = (DatePickerModule as any).default || DatePickerModule;
import { 
  CreditCard, Plus, Edit2, Trash2, CheckCircle, Clock, X, Save, 
  ArrowDownLeft, BookOpen, ArrowUpRight, Calendar, Building2, HelpCircle, AlertTriangle, Search, TrendingUp, DollarSign, Percent, BarChart as BarChartIcon, ChevronDown, Printer, History, Activity, User, Send
, ArrowLeft} from 'lucide-react';
import { 
  getCheckbooks, addCheckbook, updateCheckbook, deleteCheckbook, 
  getIssuedChecks, addIssuedCheck, updateIssuedCheck, deleteIssuedCheck, 
  getReceivedChecks, addReceivedCheck, updateReceivedCheck, deleteReceivedCheck, getCheckHistory, addCheckHistory, 
  getAccounts, getPersons, addTransaction, getTransactions, deleteTransaction
, addAccountingDocument, getLedgerAccounts } from '../../services/dataService';
import { Checkbook, IssuedCheck, ReceivedCheck, Account, Person } from '../../types';
import { formatDateDisplay } from '../../utils/format';

export default function CheckManagement({ showNotification, activeTab = 'checkbooks', onDataChange, currentUser = 'کاربر سیستم', sendNotification, storeSettings, setViewingCheck, onEditReceiptByCheck }: { showNotification?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void, activeTab?: 'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel', onDataChange?: () => void, currentUser?: string, sendNotification?: any, storeSettings?: any, setViewingCheck?: any, onEditReceiptByCheck?: any }) {

  const notify = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (showNotification) {
      showNotification(msg, type);
    } else {
      showNotification(msg, 'error');
    }
  };
  const [activeSubTab, setActiveSubTab] = useState<'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel'>(
    (activeTab === 'check_panel' || !activeTab) ? 'check_charts' : activeTab as any
  );
  
  const toPersianDigits = (str: string | number | undefined | null) => {
    if (str === null || str === undefined) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/\d/g, x => persianDigits[parseInt(x, 10)]);
  };
  
  useEffect(() => {
    if (activeTab && activeTab !== 'check_panel') setActiveSubTab(activeTab as any);
  }, [activeTab]);
  const [checkbooks, setCheckbooks] = useState<Checkbook[]>([]);
  const [issuedChecks, setIssuedChecks] = useState<IssuedCheck[]>([]);
  const [receivedChecks, setReceivedChecks] = useState<ReceivedCheck[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  
  // Custom queries
  const [issuedSearchQuery, setIssuedSearchQuery] = useState('');
  const [receivedSearchQuery, setReceivedSearchQuery] = useState('');
  
  const [issuedSortBy, setIssuedSortBy] = useState<'date' | 'amount'>('date');
  const [issuedSortDir, setIssuedSortDir] = useState<'asc' | 'desc'>('asc');
  
  const [receivedSortBy, setReceivedSortBy] = useState<'date' | 'amount'>('date');
  const [receivedSortDir, setReceivedSortDir] = useState<'asc' | 'desc'>('asc');

  const [depositAccountId, setDepositAccountId] = useState('');
  const [assignedVendorId, setAssignedVendorId] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<any[]>([new Date()]);

  
  const safeParseDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return new Date(dateStr);
    try {
      if (dateStr.includes('/')) return new DateObject({ date: dateStr, format: "YYYY/MM/DD", calendar: persian }).toDate();
    } catch(e) {}
    return '';
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
  
  // Modals state
  const [isIssuedModalOpen, setIsIssuedModalOpen] = useState(false);
  const [isReceivedModalOpen, setIsReceivedModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  
  const [editingIssuedCheckId, setEditingIssuedCheckId] = useState<string|number|null>(null);
  const [editingReceivedCheckId, setEditingReceivedCheckId] = useState<string|number|null>(null);

  // Issued Check form state
  const [icCheckbookId, setIcCheckbookId] = useState('');
  const [icCheckNumber, setIcCheckNumber] = useState('');
  const [icPayeeId, setIcPayeeId] = useState('');
  const [icAmount, setIcAmount] = useState('');
  const [icIssueDate, setIcIssueDate] = useState('');
  const [icDueDate, setIcDueDate] = useState('');
  const [icDescription, setIcDescription] = useState('');

  // Received Check form state
  const [rcPayerId, setRcPayerId] = useState('');
  const [rcBankName, setRcBankName] = useState('');
  const [rcBranchName, setRcBranchName] = useState('');
  const [rcCheckNumber, setRcCheckNumber] = useState('');
  const [rcAmount, setRcAmount] = useState('');
  const [rcReceiveDate, setRcReceiveDate] = useState('');
  const [rcDueDate, setRcDueDate] = useState('');
  const [rcDescription, setRcDescription] = useState('');

  // Status adjustment form state
  const [updatingCheckType, setUpdatingCheckType] = useState<'issued' | 'received'>('issued');
  const [updatingCheckId, setUpdatingCheckId] = useState<string|number|null>(null);
  const [expandedCheckId, setExpandedCheckId] = useState<string|number|null>(null);
  const [statusVal, setStatusVal] = useState('');

  const currentCheckForStatus = updatingCheckType === 'issued' ? issuedChecks.find(c => c.id === updatingCheckId) : receivedChecks.find(c => c.id === updatingCheckId);
  const currentActualStatus = currentCheckForStatus?.status || (updatingCheckType === 'issued' ? 'issued' : 'received');

  const getValidTransitions = (type: 'issued' | 'received', currentStatus: string) => {
    if (type === 'issued') {
      switch(currentStatus) {
        case 'issued': return ['issued', 'cashed', 'bounced', 'cancelled'];
        case 'cashed': return ['cashed', 'issued']; // can only revert
        case 'bounced': return ['bounced', 'cashed', 'issued']; // can revert
        case 'cancelled': return ['cancelled', 'issued']; // can revert
        default: return ['issued', 'cashed', 'bounced', 'cancelled'];
      }
    } else {
      switch(currentStatus) {
        case 'received': return ['received', 'deposited', 'cashed', 'assigned', 'bounced', 'returned'];
        case 'deposited': return ['deposited', 'cashed', 'bounced', 'received'];
        case 'cashed': return ['cashed', 'deposited', 'received']; // revert
        case 'assigned': return ['assigned', 'bounced_assigned', 'received'];
        case 'bounced_assigned': return ['bounced_assigned', 'returned', 'assigned'];
        case 'bounced': return ['bounced', 'returned', 'deposited', 'received'];
        case 'returned': return ['returned', 'bounced_assigned', 'bounced', 'received'];
        default: return ['received', 'deposited', 'cashed', 'assigned', 'bounced_assigned', 'bounced', 'returned'];
      }
    }
  };
  const validTransitions = getValidTransitions(updatingCheckType, currentActualStatus);

  const [statusDesc, setStatusDesc] = useState('');

  // Status Filter State
  const [issuedCheckStatusFilter, setIssuedCheckStatusFilter] = useState<string>('all');
  const [issuedCheckbookFilter, setIssuedCheckbookFilter] = useState<string>('all');
  const [receivedCheckStatusFilter, setReceivedCheckStatusFilter] = useState<string>('all');

  // History view state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyCheck, setHistoryCheck] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (onDataChange) onDataChange();
    setCheckbooks(await getCheckbooks());
    setIssuedChecks(await getIssuedChecks());
    setReceivedChecks(await getReceivedChecks());
    setAccounts(await getAccounts());
    setPersons(await getPersons());
  };



  const handleIssueCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icCheckNumber || !icAmount || !icPayeeId || !icDueDate) {
      showNotification('لطفاً اطلاعات ضروری را وارد کنید', 'error');
      return;
    }

    const payload = {
      checkbookId: icCheckbookId || '',
      checkNumber: icCheckNumber,
      amount: Number(icAmount),
      payeeId: icPayeeId,
      issueDate: icIssueDate || new Date().toISOString(),
      dueDate: icDueDate,
      status: 'issued', // Default
      description: icDescription
    };

    const blankCheck = issuedChecks.find(c => c.status === 'blank' && c.checkbookId?.toString() === payload.checkbookId?.toString() && c.checkNumber === payload.checkNumber);
    if (blankCheck && !editingIssuedCheckId) {
       await updateIssuedCheck(blankCheck.id.toString(), { ...blankCheck, ...payload, status: 'issued' } as any);
    } else if (editingIssuedCheckId) {
      const existing = issuedChecks.find(c => c.id === editingIssuedCheckId);
      if (existing) {
        await updateIssuedCheck(editingIssuedCheckId.toString(), { ...existing, ...payload, status: existing.status || 'issued' } as any);
      }
    } else {
      await addIssuedCheck(payload);
    }
    
    setIsIssuedModalOpen(false);
    
    // Clear inputs
    setEditingIssuedCheckId(null);
    setIcCheckbookId('');
    setIcCheckNumber('');
    setIcPayeeId('');
    setIcAmount('');
    setIcIssueDate('');
    setIcDueDate('');
    setIcDescription('');
    
    fetchData();
  };

  const handleReceiveCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcCheckNumber || !rcAmount || !rcPayerId || !rcBankName || !rcDueDate) {
      showNotification('لطفاً اطلاعات ضروری را وارد کنید', 'error');
      return;
    }

    const payload = {
      checkNumber: rcCheckNumber,
      bankName: rcBankName,
      branchName: rcBranchName,
      amount: Number(rcAmount),
      payerId: rcPayerId,
      receiveDate: rcReceiveDate || new Date().toISOString(),
      dueDate: rcDueDate,
      status: 'received', // Default
      description: rcDescription
    };

    if (editingReceivedCheckId) {
      const existing = receivedChecks.find(c => c.id === editingReceivedCheckId);
      if (existing) {
         await updateReceivedCheck(editingReceivedCheckId.toString(), { ...existing, ...payload, status: existing.status || 'received' } as any);
      }
    } else {
      await addReceivedCheck(payload);
    }
    
    setIsReceivedModalOpen(false);

    // Clear inputs
    setEditingReceivedCheckId(null);
    setRcPayerId('');
    setRcBankName('');
    setRcBranchName('');
    setRcCheckNumber('');
    setRcAmount('');
    setRcReceiveDate('');
    setRcDueDate('');
    setRcDescription('');

    fetchData();
  };

  
  const rollbackCashedTransaction = async (checkNumber, personId, type) => {
    try {
      const allTx = await getTransactions();
      const txType = type === 'issued' ? 'pay' : 'receive';
      const toDelete = allTx.find(tx => tx.type === txType && tx.personId === personId && tx.receiptNumber === checkNumber && tx.description && tx.description.includes(checkNumber));
      if (toDelete) {
        await deleteTransaction(toDelete.id);
      }
    } catch (err) { console.error('Error rolling back check transaction', err); }
  };
  
  const rollbackCreationTransaction = async (checkNumber, personId, type) => {
    try {
      const allTx = await getTransactions();
      const txType = type === 'issued' ? 'pay' : 'receive';
      const toDelete = allTx.find(tx => tx.type === txType && tx.personId === personId && tx.method === 'check' && tx.checkNumber === checkNumber);
      if (toDelete) {
        await deleteTransaction(toDelete.id);
      }
    } catch (err) { console.error('Error rolling back creation transaction', err); }
  };

  
  

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingCheckId) return;


    if (updatingCheckType === 'issued') {
      const existing = issuedChecks.find(c => c.id === updatingCheckId);
      if (existing) {
        const wasAlreadyCashed = existing.status === 'cashed';
        
        if (statusVal === 'cashed' && !wasAlreadyCashed && !depositAccountId) {
          notify('لطفاً بانک مبدا جهت کسر وجه چک را انتخاب کنید', 'error');
          return;
        }

        await addCheckHistory({ checkId: existing.id, checkType: 'issued', status: statusVal, date: new Date().toISOString(), desc: statusDesc, user: currentUser });
        await updateIssuedCheck(updatingCheckId.toString(), { ...existing, status: statusVal as any, bankAccountId: statusVal === 'cashed' ? depositAccountId : existing.bankAccountId });

        if (statusVal === 'cashed' && !wasAlreadyCashed) {
          if (depositAccountId) {
            await addTransaction({
              type: 'payment',
              resourceType: 'bank',
              resourceId: depositAccountId,
              amount: existing.amount,
              isCheckCashing: true,
              personId: existing.payeeId,
              date: new Date().toISOString(),
              method: 'check',
              receiptNumber: existing.checkNumber,
              description: `تسویه و پاس شدن برگه چک صادره شماره ${existing.checkNumber} به ذینفع`
            });
            notify(`چک شماره ${existing.checkNumber} با موفقیت پاس شد و مبلغ ${Number(existing.amount).toLocaleString()} تومان از حساب بانک کسر و در معین شخص ثبت گردید.`, 'success');
          } else {
            notify(`چک شماره ${existing.checkNumber} پاس شد، اما به دلیل عدم یافتن بانک مرجع، سند کاهنده خودکار درج نگردید.`, 'warning');
          }
        } else if (wasAlreadyCashed && statusVal !== 'cashed') {
          // This assumes rollbackCashedTransaction exists
          await rollbackCashedTransaction(existing.checkNumber, existing.payeeId, 'issued');
          notify(`وضعیت چک صادره به ${statusVal} تغییر یافت و سند پرداختی متصل به آن حذف گردید.`, 'info');
        } else {
          notify(`وضعیت چک صادره با موفقیت تغییر یافت.`, 'info');
        }
      }
    } else {
      const existing = receivedChecks.find(c => c.id === updatingCheckId);
      if (existing) {
        const wasAlreadyCashed = existing.status === 'cashed';
        
        if ((statusVal === 'cashed' || statusVal === 'deposited') && !wasAlreadyCashed && !depositAccountId) {
          notify('لطفاً بانک مقصد جهت واریز وجه چک را انتخاب کنید', 'error');
          return;
        }

        await addCheckHistory({ checkId: existing.id, checkType: 'received', status: statusVal, date: new Date().toISOString(), desc: statusDesc, user: currentUser });
        await updateReceivedCheck(updatingCheckId.toString(), { ...existing, status: statusVal as any, assignedToId: statusVal === 'assigned' ? assignedVendorId : existing.assignedToId, accountId: statusVal === 'cashed' || statusVal === 'deposited' ? depositAccountId : existing.accountId });

        if (statusVal === 'cashed' && !wasAlreadyCashed) {
          await addTransaction({
            type: 'receive',
            resourceType: 'bank',
            resourceId: depositAccountId,
            amount: existing.amount,
            isCheckCashing: true,
            personId: existing.payerId,
            date: new Date().toISOString(),
            method: 'check',
            receiptNumber: existing.checkNumber,
            description: `وصول و نقد شدن چک دریافتی شماره ${existing.checkNumber} - بانک ${existing.bankName || ''}`
          });
          notify(`چک شماره ${existing.checkNumber} وصول گردید. مبلغ ${Number(existing.amount).toLocaleString()} تومان به حساب بانک واریز و اسناد دریافتنی بستانکار شد.`, 'success');
        } else if (statusVal === 'returned') {
          notify(`چک عودت داده شد و حساب شخص بدهکار گردید.`, 'success');
        } else if (statusVal === 'assigned' && assignedVendorId) {
          notify(`چک خرج شد و حساب شخص (فروشنده) بدهکار گردید.`, 'success');
        } else if (statusVal === 'bounced_assigned') {
          notify(`چک خرج شده برگشت خورد. اسناد دریافتنی بدهکار و فروشنده بستانکار گردید.`, 'warning');
        } else if (wasAlreadyCashed && statusVal !== 'cashed') {
          await rollbackCashedTransaction(existing.checkNumber, existing.payerId, 'receive');
          notify(`وضعیت چک دریافتی به ${statusVal} تغییر یافت و تراکنش بانکی متصل به آن حذف گردید.`, 'info');
        } else {
          notify(`وضعیت چک با موفقیت به ${statusVal} تغییر یافت.`, 'info');
        }
      }
    }
    setIsStatusModalOpen(false);
    fetchData();
  };



  const handleDeleteIssuedCheck = async (id: string|number) => {
    if (window.confirm('آیا از حذف این چک صادره اطمینان دارید؟ در صورتی که چک پاس شده باشد، سند پرداختی متصل نیز حذف خواهد شد.')) {
      const existing = issuedChecks.find(c => c.id === id);
      if (existing) {
        if (existing.status === 'cashed') {
          await rollbackCashedTransaction(existing.checkNumber, existing.payeeId, 'issued');
        }
        await rollbackCreationTransaction(existing.checkNumber, existing.payeeId, 'issued');
      }
      await deleteIssuedCheck(id.toString());
      fetchData();
    }
  };

  const handleDeleteReceivedCheck = async (id: string|number) => {
    if (window.confirm('آیا از حذف این چک دریافتی اطمینان دارید؟ در صورتی که چک وصول شده باشد، سند دریافتی متصل نیز حذف خواهد شد.')) {
      const existing = receivedChecks.find(c => c.id === id);
      if (existing) {
        if (existing.status === 'cashed') {
          await rollbackCashedTransaction(existing.checkNumber, existing.payerId, 'received');
        }
        await rollbackCreationTransaction(existing.checkNumber, existing.payerId, 'received');
      }
      await deleteReceivedCheck(id.toString());
      fetchData();
    }
  };

  // Filtered queries and statistical sums
  const filteredIssuedChecks = (issuedChecks || []).filter(c => {
    // Hide blank checks
    if (!c.payeeId && (!c.amount || Number(c.amount) === 0) && !c.description) {
      return false;
    }

    const payeeName = String(persons.find(p => p.id?.toString() === c.payeeId?.toString())?.name || c.payeeId || '');
    const query = issuedSearchQuery.toLowerCase();
    
    // Find bank name
    const checkbook = checkbooks.find(cb => cb.id?.toString() === c.checkbookId?.toString());
    const account = accounts.find(a => a.id?.toString() === checkbook?.accountId?.toString());
    const bankName = account ? account.bankName : '';

    const searchMatch = (
      String(c.checkNumber || '').toLowerCase().includes(query) ||
      payeeName.toLowerCase().includes(query) ||
      (c.description || '').toLowerCase().includes(query) ||
      String(c.amount || '').includes(query) ||
      String(c.dueDate || '').includes(query) ||
      String(bankName || '').toLowerCase().includes(query)
    );
    const statusMatch = issuedCheckStatusFilter === 'all' || c.status === issuedCheckStatusFilter;
    const checkbookMatch = issuedCheckbookFilter === 'all' || c.checkbookId?.toString() === issuedCheckbookFilter;
    return searchMatch && statusMatch && checkbookMatch;
  }).sort((a, b) => {
    let diff = 0;
    if (issuedSortBy === 'date') diff = normalizeDate(a.dueDate) - normalizeDate(b.dueDate);
    else diff = Number(a.amount) - Number(b.amount);
    return issuedSortDir === 'asc' ? diff : -diff;
  });

  const filteredReceivedChecks = (receivedChecks || []).filter(c => {
    const payerName = String(persons.find(p => p.id?.toString() === c.payerId?.toString())?.name || c.payerId || '');
    const query = receivedSearchQuery.toLowerCase();
    const searchMatch = (
      String(c.checkNumber || '').toLowerCase().includes(query) ||
      payerName.toLowerCase().includes(query) ||
      String(c.bankName || '').toLowerCase().includes(query) ||
      (c.description || '').toLowerCase().includes(query) ||
      String(c.amount || '').includes(query) ||
      String(c.dueDate || '').includes(query)
    );
    const statusMatch = receivedCheckStatusFilter === 'all' || c.status === receivedCheckStatusFilter;
    return searchMatch && statusMatch;
  }).sort((a, b) => {
    let diff = 0;
    if (receivedSortBy === 'date') diff = normalizeDate(a.dueDate) - normalizeDate(b.dueDate);
    else diff = Number(a.amount) - Number(b.amount);
    return receivedSortDir === 'asc' ? diff : -diff;
  });

  // KPI Calculations
  const totalIssuedAmount = issuedChecks.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const cashedIssuedAmount = (issuedChecks || []).filter(c => c.status === 'cashed').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const bouncedIssuedAmount = (issuedChecks || []).filter(c => c.status === 'bounced').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const pendingIssuedAmount = (issuedChecks || []).filter(c => c.status === 'issued' || !c.status).reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const totalReceivedAmount = receivedChecks.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const cashedReceivedAmount = (receivedChecks || []).filter(c => c.status === 'cashed').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const bouncedReceivedAmount = (receivedChecks || []).filter(c => c.status === 'bounced').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const inHandReceivedAmount = (receivedChecks || []).filter(c => c.status === 'received' || c.status === 'deposited' || !c.status).reduce((sum, c) => sum + Number(c.amount || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0" dir="rtl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-l from-indigo-50/40 to-white print:hidden">
         <div>
           <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
             <CreditCard className="w-6 h-6 text-indigo-600" /> 
             {activeSubTab === 'checkbooks' ? 'مدیریت و لیست دسته چک‌ها' : activeSubTab === 'issued_checks' ? 'مدیریت چک‌های صادره (پرداختی)' : activeSubTab === 'check_calendar' ? 'تقویم سررسید چک‌ها' : activeSubTab === 'check_charts' ? 'داشبورد و نمودار وضعیت چک‌ها' : 'مدیریت چک‌های دریافتی (وصولی)'}
           </h1>
           <p className="text-xs text-gray-500 mt-1">
             {activeSubTab === 'checkbooks' ? 'تعریف و نظارت بر دسته‌چک‌های بانکی اختصاصی' : activeSubTab === 'issued_checks' ? 'نظارت بر وضعیت برگه‌های چک پرداخت شده به حساب مشتریان و تامین‌کنندگان' : activeSubTab === 'check_calendar' ? 'نظارت تصویری بر تاریخ‌های سررسید چک‌ها بوسیله تقویم ماهانه' : activeSubTab === 'check_charts' ? 'گزارش‌گیری و نمایش بصری وضعیت و گردش چک‌های پرداختی و دریافتی' : 'مدیریت وضعیت وصول و اقلام چک‌های دریافت شده از اشخاص'}
           </p>
         </div>
      </div>
      {/* Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 px-8 py-3 border-b border-gray-100 bg-gray-50/50 print:hidden">
        {[
          { id: 'check_charts', label: 'داشبورد', icon: <BarChartIcon className="w-4 h-4" /> },
          { id: 'received_checks', label: 'چک‌های دریافتی', icon: <ArrowDownLeft className="w-4 h-4" /> },
          { id: 'issued_checks', label: 'چک‌های پرداختی', icon: <ArrowUpRight className="w-4 h-4" /> },
          { id: 'checkbooks', label: 'دسته چک‌ها', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'check_calendar', label: 'تقویم چک‌ها', icon: <Calendar className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>


      <div className="p-8 print:p-0">
        
        {/* Print Only Header */}
        <div className="hidden print:flex flex-col items-center justify-center mb-8 border-b-2 border-gray-800 pb-4">
          <h2 className="text-2xl font-black text-black mb-2">
             {activeSubTab === 'issued_checks' ? 'لیست چک‌های پرداختی (صادره)' : activeSubTab === 'received_checks' ? 'لیست چک‌های دریافتی (وصولی)' : 'لیست چک‌ها'}
          </h2>
          <p className="text-sm font-bold text-gray-700">تاریخ چاپ: {new Date().toLocaleDateString('fa-IR')} - ساعت: {new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'})}</p>
        </div>

        
        {/* SUBTAB 1: CHECKBOOKS */}
        {activeSubTab === 'checkbooks' ? (
           <CheckbooksManager
              checkbooks={checkbooks}
              setCheckbooks={setCheckbooks}
              accounts={accounts}
              setIssuedCheckbookFilter={setIssuedCheckbookFilter}
              setActiveSubTab={setActiveSubTab}
              formatDateDisplay={formatDateDisplay}
              storeSettings={storeSettings}
              getCheckbooks={getCheckbooks}
              addCheckbook={addCheckbook}
              updateCheckbook={updateCheckbook}
              deleteCheckbook={deleteCheckbook}
              notify={notify}
              safeParseDate={safeParseDate}
           />
        ) : activeSubTab === 'issued_checks' ? (

          /* SUBTAB 2: ISSUED CHECKS */
          <div>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:hidden">
              <div className="bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-indigo-900 block">کل چک‌های صادره</span>
                  <span className="text-base font-black text-indigo-950 font-sans block mt-1">{totalIssuedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/40 to-white border border-emerald-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-emerald-950 block">مبلغ وصول شده (پاس شده)</span>
                  <span className="text-base font-black text-emerald-700 font-sans block mt-1">{cashedIssuedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50/40 to-white border border-amber-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-amber-900 block">در جریان سررسید</span>
                  <span className="text-base font-black text-amber-700 font-sans block mt-1">{pendingIssuedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 animate-pulse">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50/40 to-white border border-rose-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-rose-900 block">برگشت خورده (بک‌خورده)</span>
                  <span className="text-base font-black text-rose-600 font-sans block mt-1">{bouncedIssuedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Status Flow Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 print:hidden scrollbar-hide">
              {['all', 'blank', 'issued', 'cashed', 'bounced', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setIssuedCheckStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${issuedCheckStatusFilter === status ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {status === 'all' ? 'همه چک‌ها' : status === 'blank' ? 'برگ سفید' : status === 'issued' ? 'در جریان (صادره)' : status === 'cashed' ? 'پاس شده' : status === 'bounced' ? 'برگشتی' : 'باطل شده'}
                </button>
              ))}
            </div>

            {/* Actions & Filters Panel */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-50/40 border border-gray-100 p-4 rounded-xl print:hidden">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={issuedSearchQuery} 
                  onChange={e => setIssuedSearchQuery(e.target.value)} 
                  placeholder="جستجو بر اساس شماره چک، نام شخص، مبلغ، بانک، سررسید..."
                  className="w-full pr-10 pl-4 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>


              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                  <select 
                    value={issuedCheckbookFilter}
                    onChange={e => setIssuedCheckbookFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 outline-none px-2 py-1 cursor-pointer max-w-[120px] truncate"
                  >
                    <option value="all">همه دسته‌چک‌ها</option>
                    {(checkbooks || []).map(cb => {
                      const bank = accounts.find(a => a.id == cb.accountId)?.bankName || 'حساب';
                      return <option key={cb.id} value={cb.id.toString()}>{bank} ({cb.startNumber})</option>
                    })}
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                  <select 
                    value={issuedSortBy} 
                    onChange={e => setIssuedSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-gray-700 outline-none px-2 py-1 cursor-pointer"
                  >
                    <option value="date">سررسید</option>
                    <option value="amount">مبلغ</option>
                  </select>
                  <button 
                    onClick={() => setIssuedSortDir(prev => prev === 'asc' ? 'desc' : 'asc')} 
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                  >
                    {issuedSortDir === 'asc' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </button>
                </div>
                
                <button 
                  onClick={() => window.print()}
                  className="p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
                  title="چاپ لیست"
                >
                  <Printer className="w-4 h-4" />
                </button>
                
                <span className="text-xs font-bold text-gray-550 hidden sm:inline-block">تعداد یافت شده: {filteredIssuedChecks.length}</span>
              </div>
            </div>

            <div className="print-section w-full">
              {/* Print Only Header */}
              <div className="hidden print:block mb-6 border-b-2 border-slate-800 pb-4 text-center">
                <h1 className="text-xl font-extrabold text-slate-900 font-sans">سامانه مدیریت مالی و حسابداری</h1>
                <p className="text-sm text-gray-650 font-bold mt-1.5">گزارش و لیست چک‌های صادره (پرداختنی)</p>
                <div className="flex justify-between items-center mt-5 text-xs text-slate-500 border-t border-slate-100 pt-3 font-bold">
                  <span>تاریخ چاپ: {toPersianDigits(new Date().toLocaleDateString('fa-IR'))}</span>
                  <span>تعداد کل اقلام: {toPersianDigits(filteredIssuedChecks.length)}</span>
                </div>
              </div>

              <div className="overflow-x-auto print:overflow-visible border border-gray-100 print:border-none rounded-2xl print:rounded-none shadow-xs print:shadow-none bg-white">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-4 font-bold">شماره چک</th>
                      <th className="px-4 py-4 font-bold">دسته چک / حساب</th>
                      <th className="px-4 py-4 font-bold">بابت (گیرنده چک)</th>
                      <th className="px-4 py-4 font-bold">مبلغ ({storeSettings?.currency || 'تومان'})</th>
                      <th className="px-4 py-4 font-bold">سررسید و مهلت</th>
                      <th className="px-4 py-4 font-bold">وضعیت</th>
                      <th className="px-4 py-4 font-bold text-center w-36 print:hidden">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {filteredIssuedChecks.map(c => {
                      const cb = checkbooks.find(x => x.id == c.checkbookId);
                      const acc = accounts.find(a => a.id == cb?.accountId);
                      const bankName = acc?.bankName || 'پرداخت نقدی/مستقیم';
                      const payee = persons.find(p => p.id?.toString() === c.payeeId?.toString());
                      return (
                        <React.Fragment key={c.id}>
<tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3.5">
                            <div 
                              className="font-mono font-black text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline transition-colors decoration-dashed underline-offset-4"
                              onClick={() => setViewingCheck && setViewingCheck({ ...c, _type: 'issued' })}
                              title="مشاهده جزئیات چک"
                            >
                              {toPersianDigits(c.checkNumber)}
                            </div>
                            <div className="text-[10px] text-gray-550 font-bold mt-1 max-w-[120px] truncate">{c.receiptNumber ? `رسید: ${toPersianDigits(c.receiptNumber)}` : `بدون شناسه رسید`}</div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-indigo-950 font-bold max-w-[150px] truncate">{bankName}</td>
                          <td className="px-4 py-3.5 font-bold text-gray-800">{payee?.name || c.payeeId || 'ناشناس'}</td>
                          <td className="px-4 py-3.5 font-sans font-black text-rose-600">{toPersianDigits(Number(c.amount).toLocaleString())}</td>
                          <td className="px-4 py-3.5">
                             <div className="font-sans font-medium text-gray-700">{toPersianDigits(formatDateDisplay(c.dueDate, storeSettings?.calendarType))}</div>
                             {(!c.status || c.status === 'issued') && (
                               <div className="mt-2 flex items-center gap-2 print:hidden w-32">
                                 <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                   <div className={`h-full ${getDaysRemaining(c.dueDate) < 0 ? 'bg-rose-500' : getDaysRemaining(c.dueDate) <= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, Math.max(5, (30 - getDaysRemaining(c.dueDate)) / 30 * 100))}%` }}></div>
                                 </div>
                                 <span className={`text-[10px] font-bold ${getDaysRemaining(c.dueDate) < 0 ? 'text-rose-600' : getDaysRemaining(c.dueDate) <= 3 ? 'text-amber-600' : 'text-gray-500'}`}>
                                   {getDaysRemaining(c.dueDate) < 0 ? `${toPersianDigits(Math.abs(getDaysRemaining(c.dueDate)))} روز گذشته` : getDaysRemaining(c.dueDate) === 0 ? 'امروز' : `${toPersianDigits(getDaysRemaining(c.dueDate))} روز`}
                                 </span>
                               </div>
                             )}
                          </td>
                          <td className="px-4 py-3.5">
                             <div className={`relative inline-block rounded-lg text-xs font-bold border ${
                               c.status === 'cashed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                               c.status === 'bounced' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                               c.status === 'cancelled' ? 'bg-gray-100 text-gray-600 border-gray-200 line-through' :
                               'bg-amber-50 text-amber-700 border-amber-100'
                             }`}>
                               <span>{c.status === "cashed" ? "پاس شده" : c.status === "bounced" ? "برگشتی" : c.status === "cancelled" ? "باطل شده" : "در جریان (صادره)"}</span>
                             </div>
                          </td>
                          <td className="px-4 py-3.5 print:hidden">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={async () => {
                                  setHistoryCheck({ ...c, checkType: 'issued' });
                                  const h = await getCheckHistory(c.id, 'issued');
                                  const oldHistory = c.history || [];
                                  const combined = [...oldHistory, ...h].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                  setHistoryData(combined);
                                  setIsHistoryModalOpen(true);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 inline-block"
                                title="مشاهده سوابق و رهگیری وضعیت"
                              >
                                <History className="w-4 h-4" />
                              </button>
                                                            <button 
                                onClick={() => { setUpdatingCheckId(c.id); setUpdatingCheckType('issued'); setStatusVal(c.status || 'issued'); setIsStatusModalOpen(true); }}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 inline-block"
                                title="مدیریت وضعیت چک"
                              >
                                <Activity className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { 
                                  if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'issued');
                                  } else {
                                    showNotification('این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.', 'error');
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 inline-block"
                                title="ویرایش چک"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteIssuedCheck(c.id)} 
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 inline-block"
                                title="حذف چک"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

</React.Fragment>
);
})}
                    {filteredIssuedChecks.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-gray-400 text-sm font-medium">
                          <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          هیچ چکی مطابق شرایط جستجو در سیستم صادر نشده است
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeSubTab === 'received_checks' ? (
          /* SUBTAB 3: RECEIVED CHECKS */
          <div>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:hidden">
              <div className="bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-indigo-900 block">مجموع چک‌های دریافتی</span>
                  <span className="text-base font-black text-indigo-950 font-sans block mt-1">{totalReceivedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/40 to-white border border-emerald-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-emerald-950 block">مبلع وصول شده و نقد شده</span>
                  <span className="text-base font-black text-emerald-750 font-sans block mt-1">{cashedReceivedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50/40 to-white border border-amber-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-amber-900 block">موجود فیزیکی یا خوابانده</span>
                  <span className="text-base font-black text-amber-700 font-sans block mt-1">{inHandReceivedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 animate-pulse">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50/40 to-white border border-rose-100/60 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-rose-900 block">برگشت خورده (مشتری)</span>
                  <span className="text-base font-black text-rose-650 font-sans block mt-1">{bouncedReceivedAmount.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">تومان</span></span>
                </div>
                <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Status Flow Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 print:hidden scrollbar-hide">
              {['all', 'received', 'deposited', 'cashed', 'bounced', 'returned'].map(status => (
                <button
                  key={status}
                  onClick={() => setReceivedCheckStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${receivedCheckStatusFilter === status ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {status === 'all' ? 'همه چک‌ها' : status === 'received' ? 'موجود صندوق' : status === 'deposited' ? 'واگذار شده' : status === 'cashed' ? 'وصول شده' : status === 'bounced' ? 'برگشتی' : 'عودت داده شده'}
                </button>
              ))}
            </div>

            {/* Actions & Filters Panel */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-50/40 border border-gray-100 p-4 rounded-xl print:hidden">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={receivedSearchQuery} 
                  onChange={e => setReceivedSearchQuery(e.target.value)} 
                  placeholder="جستجو بر اساس شماره چک، نام شخص، مبلغ، بانک، سررسید..."
                  className="w-full pr-10 pl-4 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                  <select 
                    value={receivedSortBy} 
                    onChange={e => setReceivedSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-gray-700 outline-none px-2 py-1 cursor-pointer"
                  >
                    <option value="date">سررسید</option>
                    <option value="amount">مبلغ</option>
                  </select>
                  <button 
                    onClick={() => setReceivedSortDir(prev => prev === 'asc' ? 'desc' : 'asc')} 
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                  >
                    {receivedSortDir === 'asc' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </button>
                </div>
                
                <button 
                  onClick={() => window.print()}
                  className="p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
                  title="چاپ لیست"
                >
                  <Printer className="w-4 h-4" />
                </button>
                
                <span className="text-xs font-bold text-gray-550 hidden sm:inline-block">تعداد یافت شده: {filteredReceivedChecks.length}</span>
              </div>
            </div>

            <div className="print-section w-full">
              {/* Print Only Header */}
              <div className="hidden print:block mb-6 border-b-2 border-slate-800 pb-4 text-center">
                <h1 className="text-xl font-extrabold text-slate-900 font-sans">سامانه مدیریت مالی و حسابداری</h1>
                <p className="text-sm text-gray-650 font-bold mt-1.5">گزارش و لیست چک‌های دریافتی (وصولی)</p>
                <div className="flex justify-between items-center mt-5 text-xs text-slate-500 border-t border-slate-100 pt-3 font-bold">
                  <span>تاریخ چاپ: {toPersianDigits(new Date().toLocaleDateString('fa-IR'))}</span>
                  <span>تعداد کل اقلام: {toPersianDigits(filteredReceivedChecks.length)}</span>
                </div>
              </div>

              <div className="overflow-x-auto print:overflow-visible border border-gray-100 print:border-none rounded-2xl print:rounded-none shadow-xs print:shadow-none bg-white">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-4 font-bold">شماره چک</th>
                      <th className="px-4 py-4 font-bold">بانک صادرکننده</th>
                      <th className="px-4 py-4 font-bold">پرداخت‌کننده (طرف حساب)</th>
                      <th className="px-4 py-4 font-bold">مبلغ ({storeSettings?.currency || 'تومان'})</th>
                      <th className="px-4 py-4 font-bold">دریافت</th>
                      <th className="px-4 py-4 font-bold">سررسید و مهلت</th>
                      <th className="px-4 py-4 font-bold">وضعیت</th>
                      <th className="px-4 py-4 font-bold text-center w-36 print:hidden">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {filteredReceivedChecks.map(c => {
                      const payer = persons.find(p => p.id?.toString() === c.payerId?.toString());
                      return (
                        <React.Fragment key={c.id}>
<tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3.5">
                            <div 
                              className="font-mono font-black text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline transition-colors decoration-dashed underline-offset-4"
                              onClick={() => setViewingCheck && setViewingCheck({ ...c, _type: 'received' })}
                              title="مشاهده جزئیات چک"
                            >
                              {toPersianDigits(c.checkNumber)}
                            </div>
                            <div className="text-[10px] text-gray-550 font-bold mt-1 max-w-[120px] truncate">{c.receiptNumber ? `رسید: ${toPersianDigits(c.receiptNumber)}` : `بدون شناسه رسید`}</div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-indigo-950 font-bold max-w-[150px] truncate">
                            {c.bankName} {c.branchName ? `(شعبه: ${toPersianDigits(c.branchName)})` : ''}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-gray-800">{payer?.name || c.payerId || 'ناشناس'}</td>
                          <td className="px-4 py-3.5 font-sans font-black text-emerald-600">{toPersianDigits(Number(c.amount).toLocaleString())}</td>
                          <td className="px-4 py-3.5 font-sans font-medium text-gray-500 text-xs">{toPersianDigits(formatDateDisplay(c.receiveDate, storeSettings?.calendarType))}</td>
                          <td className="px-4 py-3.5">
                             <div className="font-sans font-bold text-gray-700">{toPersianDigits(formatDateDisplay(c.dueDate, storeSettings?.calendarType))}</div>
                             {(!c.status || c.status === 'received' || c.status === 'deposited') && (
                               <div className="mt-2 flex items-center gap-2 print:hidden w-32">
                                 <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                   <div className={`h-full ${getDaysRemaining(c.dueDate) < 0 ? 'bg-rose-500' : getDaysRemaining(c.dueDate) <= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, Math.max(5, (30 - getDaysRemaining(c.dueDate)) / 30 * 100))}%` }}></div>
                                 </div>
                                 <span className={`text-[10px] font-bold ${getDaysRemaining(c.dueDate) < 0 ? 'text-rose-600' : getDaysRemaining(c.dueDate) <= 3 ? 'text-amber-600' : 'text-gray-500'}`}>
                                   {getDaysRemaining(c.dueDate) < 0 ? `${toPersianDigits(Math.abs(getDaysRemaining(c.dueDate)))} روز گذشته` : getDaysRemaining(c.dueDate) === 0 ? 'امروز' : `${toPersianDigits(getDaysRemaining(c.dueDate))} روز`}
                                 </span>
                               </div>
                             )}
                          </td>
                          <td className="px-4 py-3.5">
                             <div className={`relative inline-block rounded-lg text-xs font-bold border ${
                               c.status === 'cashed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                               c.status === 'deposited' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                               c.status === 'bounced' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                               c.status === 'returned' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                               'bg-amber-50 text-amber-700 border-amber-100'
                             }`}>
                               <select
                                 value={c.status || 'received'}
                                 onChange={(e) => {
                                   setUpdatingCheckType('received');
                                   setUpdatingCheckId(c.id);
                                   setStatusVal(e.target.value);
                                   setIsStatusModalOpen(true);
                                 }}
                                 className="appearance-none bg-transparent outline-none px-2.5 py-1 pr-6 cursor-pointer text-inherit font-bold print:pl-2.5 print:pr-2.5"
                               >
                                 <option value="received">دریافت شده</option>
                                 <option value="deposited">خوابانده دفتری</option>
                                 <option value="cashed">وصول شده</option>
                                 <option value="bounced">برگشتی</option>
                                 <option value="returned">عودت داده شده</option>
                               </select>
                               <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 print:hidden" />
                             </div>
                          </td>
                          <td className="px-4 py-3.5 print:hidden">
                            <div className="flex items-center justify-center gap-1.5">
                              {sendNotification && payer?.phone && storeSettings?.smsTemplateCheck && (
                                <button
                                  onClick={async () => {
                                    let msg = storeSettings.smsTemplateCheck
                                      .replace(/{name}/g, payer.name)
                                      .replace(/{amount}/g, Number(c.amount).toLocaleString())
                                      .replace(/{check_number}/g, c.checkNumber)
                                      .replace(/{due_date}/g, c.dueDate);
                                    await sendNotification(msg, payer.phone, storeSettings?.notify_method);
                                    if(showNotification) showNotification('پیامک یادآوری با موفقیت ارسال شد', 'success');
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100 inline-block"
                                  title="ارسال پیامک یادآوری"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={async () => {
                                  setHistoryCheck({ ...c, checkType: 'received' });
                                  const h = await getCheckHistory(c.id, 'received');
                                  const oldHistory = c.history || [];
                                  const combined = [...oldHistory, ...h].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                  setHistoryData(combined);
                                  setIsHistoryModalOpen(true);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 inline-block"
                                title="مشاهده سوابق و رهگیری وضعیت"
                              >
                                <History className="w-4 h-4" />
                              </button>
                                                            <button 
                                onClick={() => { setUpdatingCheckId(c.id); setUpdatingCheckType('received'); setStatusVal(c.status || 'received'); setIsStatusModalOpen(true); }}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 inline-block"
                                title="مدیریت وضعیت چک"
                              >
                                <Activity className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { 
                                  if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'received');
                                  } else {
                                    showNotification('این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.', 'error');
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 inline-block"
                                title="ویرایش چک"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteReceivedCheck(c.id)} 
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 inline-block"
                                title="حذف چک"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

</React.Fragment>
);
})}
                    {filteredReceivedChecks.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400 text-sm font-medium">
                        <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        هیچ چکی مطابق شرایط جستجو در سیستم یافت نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        ) : activeSubTab === 'check_calendar' ? (
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
          </div>
        )}
      </div>

      <AnimatePresence>

        {/* MODAL 2: ISSUE NEW CHECK */}
        {isIssuedModalOpen && (
          <div key="isIssuedModalOpen-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl border flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 border-b pb-3 shrink-0">
                <h3 className="text-base font-black text-rose-950 flex items-center gap-1.5">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  {editingIssuedCheckId ? 'ویرایش صدور چک' : 'دستور صدور چک جدید (پرداختنی)'}
                </h3>
                <button onClick={() => setIsIssuedModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 pl-1 pr-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <form onSubmit={handleIssueCheckSubmit} className="space-y-4 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">دسته چک بانکی مرجع</label>
                    <select value={icCheckbookId} onChange={e => {
                      setIcCheckbookId(e.target.value);
                      const selectedCb = checkbooks.find(x => x.id == e.target.value);
                      if (selectedCb) {
                        const availableCheck = issuedChecks.find(ic => String(ic.checkbookId) === String(selectedCb.id) && ic.status === 'blank');
                        if (availableCheck) setIcCheckNumber(availableCheck.checkNumber);
                      }
                    }} className="w-full border rounded-xl px-4 py-2 text-sm bg-white">
                      <option value="">-- بدون انتخاب (صدور مستقیم) --</option>
                      {(checkbooks || []).map(cb => {
                        const acc = accounts.find(a => a.id == cb.accountId);
                        return <option key={cb.id} value={cb.id}>{acc?.bankName || 'نامشخص'} (برگه‌های: {cb.startNumber} تا {cb.endNumber})</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">شماره چک *</label>
                    {icCheckbookId ? (
                      <select required value={icCheckNumber} onChange={e => setIcCheckNumber(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-center bg-white" dir="ltr">
                        <option value="">-- انتخاب از برگ‌های سفید --</option>
                        {(issuedChecks || []).filter(ic => String(ic.checkbookId) === String(icCheckbookId) && ic.status === 'blank').map(c => (
                          <option key={c.id} value={c.checkNumber}>{c.checkNumber}</option>
                        ))}
                      </select>
                    ) : (
                      <input required type="text" value={icCheckNumber} onChange={e => setIcCheckNumber(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-center" dir="ltr" placeholder="مثلا 45203" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">گیرنده چک (طرف حساب ذینفع) *</label>
                  <select required value={icPayeeId} onChange={e => setIcPayeeId(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm bg-white">
                    <option value="">-- انتخاب طرف حساب --</option>
                    {(persons || []).filter(p => p.isActive !== false).map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role === 'customer' ? 'مشتری' : p.role === 'supplier' ? 'تامین کننده' : 'همکار'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">مبلغ چک (تومان) *</label>
                  <input required type="number" min="1" value={icAmount} onChange={e => setIcAmount(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-left block text-indigo-950 font-black" dir="ltr" placeholder="10,000,000" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">تاریخ صدور</label>
                    <div className="relative">
                       <DatePicker
                         value={icIssueDate as any || ''}
                         onChange={(d: any) => setIcIssueDate(d ? d.format('YYYY/MM/DD') : '')}
                         calendar={storeSettings?.calendarType === 'gregorian' ? undefined : persian}
                         locale={storeSettings?.calendarType === 'gregorian' ? undefined : persian_fa}
                         calendarPosition="bottom-right"
                         containerClassName="w-full"
                         inputClass="w-full border rounded-xl px-4 py-2 text-sm text-center font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         placeholder="انتخاب تاریخ"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">تاریخ سررسید چک *</label>
                    <div className="relative">
                       <DatePicker
                         value={safeParseDate(icDueDate)}
                         onChange={(d: any) => setIcDueDate(d ? d.toDate().toISOString() : '')}
                         calendar={storeSettings?.calendarType === 'gregorian' ? undefined : persian}
                         locale={storeSettings?.calendarType === 'gregorian' ? undefined : persian_fa}
                         calendarPosition="bottom-right"
                         containerClassName="w-full"
                         inputClass="w-full border rounded-xl px-4 py-2 text-sm font-black text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         placeholder="انتخاب تاریخ"
                       />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">توضیحات و بابت</label>
                  <textarea rows={2} value={icDescription} onChange={e => setIcDescription(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-xs" placeholder="بابت فاکتور خرید فلان یا هرگونه یادداشت اضافی..."></textarea>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t">
                  <button type="button" onClick={() => setIsIssuedModalOpen(false)} className="px-4 py-2 border bg-white border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">انصراف</button>
                  <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm">{editingIssuedCheckId ? 'ذخیره تغییرات' : 'تایید و صدور برگه چک'}</button>
                </div>
              </form>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full min-h-[350px]">
                    <h4 className="text-sm font-black text-slate-700 mb-6 flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-indigo-500" />
                      تعهدات پرداختی در محدوده سررسید (بازه ۱ ماهه)
                    </h4>
                    {icDueDate ? (
                      <div className="flex-1 w-full h-full">
                        {(() => {
                           const targetDate = new Date(icDueDate);
                           const start = new Date(targetDate); start.setDate(start.getDate() - 15);
                           const end = new Date(targetDate); end.setDate(end.getDate() + 15);
                           const filtered = issuedChecks.filter(c => {
                             if (!c.dueDate || c.status === 'blank' || c.status === 'cancelled') return false;
                             const d = new Date(c.dueDate);
                             return d >= start && d <= end;
                           });
                           
                           if (filtered.length === 0) {
                             return <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3"><CheckCircle className="w-12 h-12 text-emerald-200" /><span className="text-sm font-bold">هیچ پرداختی در این بازه زمانی وجود ندارد.</span></div>;
                           }
                           
                           const grouped = {};
                           filtered.forEach(c => {
                             let dStr;
                             try {
                               dStr = new Date(c.dueDate).toLocaleDateString('fa-IR');
                             } catch (e) {
                               dStr = c.dueDate;
                             }
                             grouped[dStr] = (grouped[dStr] || 0) + Number(c.amount);
                           });
                           
                           const chartData = Object.entries(grouped).map(([date, amount]) => ({ date, amount })).sort((a,b) => a.date.localeCompare(b.date));
                           
                           return (
                             <ResponsiveContainer width="100%" height={280}>
                               <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                 <XAxis dataKey="date" tick={{fontSize: 10, fill: '#6B7280'}} tickMargin={10} axisLine={false} tickLine={false} />
                                 <YAxis tickFormatter={(val) => (val/1000000).toFixed(0) + 'm'} tick={{fontSize: 10, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                 <Tooltip formatter={(value) => [Number(value).toLocaleString() + ' تومان', 'جمع مبالغ پرداختی']} labelStyle={{color: '#374151', fontWeight: 'bold'}} />
                                 <Bar dataKey="amount" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                               </BarChart>
                             </ResponsiveContainer>
                           );
                        })()}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-400 text-center space-y-3">
                        <Calendar className="w-12 h-12 text-slate-200" />
                        <span className="font-bold">برای مشاهده نمودار، ابتدا تاریخ سررسید را انتخاب کنید.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 3: RECEIVE NEW CHECK */}
        {isReceivedModalOpen && (
          <div key="isReceivedModalOpen-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl border flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 border-b pb-3 shrink-0">
                <h3 className="text-base font-black text-emerald-950 flex items-center gap-1.5">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                  {editingReceivedCheckId ? 'ویرایش دریافت چک' : 'ثبت و دریافت چک جدید (وصولی)'}
                </h3>
                <button onClick={() => setIsReceivedModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 pl-1 pr-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <form onSubmit={handleReceiveCheckSubmit} className="space-y-4 text-right">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">پرداخت‌کننده (طرف حساب متعهد چک) *</label>
                  <select required value={rcPayerId} onChange={e => setRcPayerId(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm bg-white">
                    <option value="">-- انتخاب پرداخت‌کننده --</option>
                    {(persons || []).filter(p => p.isActive !== false).map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role === 'customer' ? 'مشتری' : p.role === 'supplier' ? 'تامین کننده' : 'همکار'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">بانک صادرکننده چک *</label>
                    <input required type="text" value={rcBankName} onChange={e => setRcBankName(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm" placeholder="ملی، صادرات، پاسارگاد..." />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">شعبه / کد شعبه</label>
                    <input type="text" value={rcBranchName} onChange={e => setRcBranchName(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm" placeholder="شعبه مرکزی، کد 123" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">شماره چک *</label>
                    <input required type="text" value={rcCheckNumber} onChange={e => setRcCheckNumber(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-center" dir="ltr" placeholder="مثلا 12345/67" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">مبلغ چک (تومان) *</label>
                    <input required type="number" min="1" value={rcAmount} onChange={e => setRcAmount(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm font-mono text-left block text-indigo-950 font-black" dir="ltr" placeholder="25,000,000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">تاریخ دریافت چک</label>
                    <div className="relative">
                       <DatePicker
                         value={safeParseDate(rcReceiveDate)}
                         onChange={(d: any) => setRcReceiveDate(d ? d.toDate().toISOString() : '')}
                         calendar={storeSettings?.calendarType === 'gregorian' ? undefined : persian}
                         locale={storeSettings?.calendarType === 'gregorian' ? undefined : persian_fa}
                         calendarPosition="top-right"
                         containerClassName="w-full"
                         inputClass="w-full border rounded-xl px-4 py-2 text-sm text-center font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
                         placeholder="انتخاب تاریخ"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">تاریخ سررسید چک *</label>
                    <div className="relative">
                       <DatePicker
                         value={safeParseDate(rcDueDate)}
                         onChange={(d: any) => setRcDueDate(d ? d.toDate().toISOString() : '')}
                         calendar={storeSettings?.calendarType === 'gregorian' ? undefined : persian}
                         locale={storeSettings?.calendarType === 'gregorian' ? undefined : persian_fa}
                         calendarPosition="top-right"
                         containerClassName="w-full"
                         inputClass="w-full border rounded-xl px-4 py-2 text-sm text-center font-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                         placeholder="انتخاب تاریخ"
                       />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">بابت و توضیحات چک</label>
                  <textarea rows={2} value={rcDescription} onChange={e => setRcDescription(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-xs" placeholder="بابت فاکتور فروش یا هرگونه یادداشت..."></textarea>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t">
                  <button type="button" onClick={() => setIsReceivedModalOpen(false)} className="px-4 py-2 border bg-white border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">انصراف</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm">{editingReceivedCheckId ? 'ذخیره تغییرات' : 'ثبت و ذخیره چک'}</button>
                </div>
              </form>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full min-h-[350px]">
                    <h4 className="text-sm font-black text-slate-700 mb-6 flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-indigo-500" />
                      درآمدهای وصولی در محدوده سررسید (بازه ۱ ماهه)
                    </h4>
                    {rcDueDate ? (
                      <div className="flex-1 w-full h-full">
                        {(() => {
                           const targetDate = new Date(rcDueDate);
                           const start = new Date(targetDate); start.setDate(start.getDate() - 15);
                           const end = new Date(targetDate); end.setDate(end.getDate() + 15);
                           const filtered = receivedChecks.filter(c => {
                             if (!c.dueDate || c.status === 'returned') return false;
                             const d = new Date(c.dueDate);
                             return d >= start && d <= end;
                           });
                           
                           if (filtered.length === 0) {
                             return <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3"><CheckCircle className="w-12 h-12 text-emerald-200" /><span className="text-sm font-bold">هیچ وصولی در این بازه زمانی وجود ندارد.</span></div>;
                           }
                           
                           const grouped = {};
                           filtered.forEach(c => {
                             let dStr;
                             try {
                               dStr = new Date(c.dueDate).toLocaleDateString('fa-IR');
                             } catch (e) {
                               dStr = c.dueDate;
                             }
                             grouped[dStr] = (grouped[dStr] || 0) + Number(c.amount);
                           });
                           
                           const chartData = Object.entries(grouped).map(([date, amount]) => ({ date, amount })).sort((a,b) => a.date.localeCompare(b.date));
                           
                           return (
                             <ResponsiveContainer width="100%" height={280}>
                               <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                 <XAxis dataKey="date" tick={{fontSize: 10, fill: '#6B7280'}} tickMargin={10} axisLine={false} tickLine={false} />
                                 <YAxis tickFormatter={(val) => (val/1000000).toFixed(0) + 'm'} tick={{fontSize: 10, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                 <Tooltip formatter={(value) => [Number(value).toLocaleString() + ' تومان', 'جمع مبالغ وصولی']} labelStyle={{color: '#374151', fontWeight: 'bold'}} />
                                 <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                               </BarChart>
                             </ResponsiveContainer>
                           );
                        })()}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-400 text-center space-y-3">
                        <Calendar className="w-12 h-12 text-slate-200" />
                        <span className="font-bold">برای مشاهده نمودار، ابتدا تاریخ سررسید را انتخاب کنید.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 4: ADJUST STATUS */}
        {isStatusModalOpen && (
          <div key="isStatusModalOpen-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-base font-black text-gray-950">تغییر وضعیت برگه چک</h3>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); if (window.confirm('آیا از تغییر وضعیت این چک اطمینان دارید؟')) handleUpdateStatus(e); }} className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-2.5">انتخاب وضعیت جدید</label>
                    <div className="flex gap-2 flex-wrap items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {updatingCheckType === 'issued' ? (
                        <>
                          <button type="button" onClick={() => setStatusVal('issued')} disabled={!validTransitions.includes('issued')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'issued' ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'} ${!validTransitions.includes('issued') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            در جریان (صادره)
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('cashed')} disabled={!validTransitions.includes('cashed')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'cashed' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'} ${!validTransitions.includes('cashed') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            پاس شده
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('bounced')} disabled={!validTransitions.includes('bounced')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'bounced' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'} ${!validTransitions.includes('bounced') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            برگشتی
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('cancelled')} disabled={!validTransitions.includes('cancelled')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'cancelled' ? 'bg-slate-600 text-white border-slate-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'} ${!validTransitions.includes('cancelled') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            باطل شده
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => setStatusVal('received')} disabled={!validTransitions.includes('received')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'received' ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'} ${!validTransitions.includes('received') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            دریافت شده
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('deposited')} disabled={!validTransitions.includes('deposited')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'deposited' ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105' : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-50'} ${!validTransitions.includes('deposited') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            خوابانده به حساب
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('cashed')} disabled={!validTransitions.includes('cashed')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'cashed' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'} ${!validTransitions.includes('cashed') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            وصول شده
                          </button>
                          
                          <div className="w-full h-1 my-1 border-b border-gray-200 border-dashed"></div>
                          
                          <button type="button" onClick={() => setStatusVal('assigned')} disabled={!validTransitions.includes('assigned')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'assigned' ? 'bg-orange-600 text-white border-orange-700 shadow-md scale-105' : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50'} ${!validTransitions.includes('assigned') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            خرج شده (واگذاری)
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('bounced_assigned')} disabled={!validTransitions.includes('bounced_assigned')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'bounced_assigned' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'} ${!validTransitions.includes('bounced_assigned') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            برگشتی (خرج شده)
                          </button>
                          
                          <div className="w-full h-1 my-1 border-b border-gray-200 border-dashed"></div>

                          <button type="button" onClick={() => setStatusVal('bounced')} disabled={!validTransitions.includes('bounced')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'bounced' ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-105' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'} ${!validTransitions.includes('bounced') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            برگشتی (موجود)
                          </button>
                          <ArrowLeft className="w-3 h-3 text-gray-300" />
                          <button type="button" onClick={() => setStatusVal('returned')} disabled={!validTransitions.includes('returned')} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${statusVal === 'returned' ? 'bg-slate-600 text-white border-slate-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'} ${!validTransitions.includes('returned') ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                            عودت داده شده
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {updatingCheckType === 'received' && (statusVal === 'cashed' || statusVal === 'deposited') && (
                    <div className="bg-amber-50/50 p-3.5 border border-amber-100 rounded-xl space-y-1 mt-3 animate-fadeIn">
                       <label className="block text-[10px] font-black text-amber-900 mb-0.5">بانک مقصد جهت واریز وجه چک *</label>
                       <select
                          required
                          value={depositAccountId}
                          onChange={e => setDepositAccountId(e.target.value)} 
                          className="w-full border border-amber-200 rounded-lg px-3 py-2 text-xs bg-white font-bold"
                       >
                         <option value="">-- انتخاب حساب بانکی --</option>
                         {(accounts || []).map((a, idx) => (
                           <option key={a.id ? "cm-dep-acc-" + a.id + "-" + idx : "cm-dep-idx-" + idx} value={a.id}>{a.bankName} - {a.accountNumber || a.cardNumber}</option>
                         ))}
                       </select>
                       <p className="text-[9px] text-amber-700 font-bold mt-1">با تایید وصولی، موجودی حساب فوق افزایش می‌یابد و سند دریافت درج خواهد شد.</p>
                    </div>
                  )}
                  
                  {updatingCheckType === 'issued' && statusVal === 'cashed' && (
                    <div className="bg-amber-50/50 p-3.5 border border-amber-100 rounded-xl space-y-1 mt-3 animate-fadeIn">
                       <label className="block text-[10px] font-black text-amber-900 mb-0.5">بانک مبدا جهت کسر وجه چک *</label>
                       <select
                          required
                          value={depositAccountId}
                          onChange={e => setDepositAccountId(e.target.value)} 
                          className="w-full border border-amber-200 rounded-lg px-3 py-2 text-xs bg-white font-bold"
                       >
                         <option value="">-- انتخاب حساب بانکی --</option>
                         {(accounts || []).map((a, idx) => (
                           <option key={a.id ? "cm-src-acc-" + a.id + "-" + idx : "cm-src-idx-" + idx} value={a.id}>{a.bankName} - {a.accountNumber || a.cardNumber}</option>
                         ))}
                       </select>
                       <p className="text-[9px] text-amber-700 font-bold mt-1">با تایید پاس شدن، موجودی حساب فوق کسر می‌گردد.</p>
                    </div>
                  )}

                  {updatingCheckType === 'received' && statusVal === 'assigned' && (
                    <div className="bg-amber-50/50 p-3.5 border border-amber-100 rounded-xl space-y-1 mt-3 animate-fadeIn">
                       <label className="block text-[10px] font-black text-amber-900 mb-0.5">شخص گیرنده چک (فروشنده) *</label>
                       <select
                          required
                          value={assignedVendorId}
                          onChange={e => setAssignedVendorId(e.target.value)} 
                          className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-500/20"
                       >
                          <option value="">-- انتخاب شخص --</option>
                          {(persons || []).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                       </select>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <label className="block text-xs font-black text-gray-700 mb-1.5">توضیحات و سوابق (اختیاری)</label>
                    <textarea value={statusDesc} onChange={e => setStatusDesc(e.target.value)} placeholder="دلیل تغییر وضعیت یا تاریخچه..." className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white" rows={2}></textarea>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 transition-all">تایید و اعمال وضعیت</button>
                  </div>
</form>
            </motion.div>
          </div>
        )}
        {/* MODAL: CHECK HISTORY */}
        {isHistoryModalOpen && historyCheck && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm print:absolute print:inset-0 print:p-0 print:bg-white" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-gray-100 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
              <div className="flex justify-between items-center p-6 border-b print:hidden">
                <h3 className="text-base font-black text-gray-950 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  سوابق و تاریخچه عملیات چک 
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-200" title="چاپ تاریخچه"><Printer className="w-4 h-4" /></button>
                  <button onClick={() => { setIsHistoryModalOpen(false); setHistoryCheck(null); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto print:p-0 print:pt-4">
                {/* Print Header inside modal */}
                <div className="hidden print:block mb-6 text-center border-b pb-4">
                  <h2 className="text-xl font-black text-gray-900 mb-2">گزارش وضعیت و سوابق چک</h2>
                  <p className="text-sm font-bold text-gray-700">شماره چک: {historyCheck.checkNumber}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-1">نوع چک:</span>
                    <span className="font-bold text-gray-900">{historyCheck.checkType === 'issued' ? 'صادره (پرداختی)' : 'دریافتی'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">شماره چک:</span>
                    <span className="font-mono font-black text-gray-900 text-sm">{historyCheck.checkNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">مبلغ:</span>
                    <span className="font-sans font-black text-emerald-600 tracking-tight text-sm text-left block" dir="ltr">{Number(historyCheck.amount).toLocaleString()} <span className="text-[10px] text-gray-400">تومان</span></span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">تاریخ سررسید:</span>
                    <span className="font-bold text-gray-900">{historyCheck.dueDate}</span>
                  </div>
                  <div className="col-span-2">
                     <span className="text-gray-500 block mb-1">طرف حساب:</span>
                     <span className="font-bold text-gray-900">{persons.find(p => p.id === historyCheck.payerId || p.id === historyCheck.payeeId)?.name || historyCheck.payerId || historyCheck.payeeId}</span>
                  </div>
                </div>

                <h4 className="font-black text-sm text-gray-800 mb-4 pb-2 border-b flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> گردش وضعیت</h4>
                <div className="space-y-4">
                  {(!historyData || historyData.length === 0) ? (
                    <div className="text-center py-6 text-xs font-bold text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      تاکنون تاریخچه‌ای برای تغییر وضعیت این چک ثبت نشده است. (وضعیت اولیه)
                    </div>
                  ) : (
                    <div className="relative border-r-2 border-slate-100 pr-4 space-y-6 max-h-[40vh] overflow-y-auto print:max-h-none print:overflow-visible my-2">
                       {historyData.map((h: any, i: number) => {
                          const dateObj = new Date(h.date);
                          const formattedDate = dateObj.toLocaleDateString('fa-IR');
                          const formattedTime = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div key={i} className="relative">
                              <span className="absolute -right-[23px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white print:border-none shadow-sm"></span>
                              <div className="text-xs text-gray-400 mb-1 border-b border-gray-50 pb-1.5 flex justify-between">
                                 <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
                                   {
                                     h.status === 'issued' ? 'صدور چک' :
                                     h.status === 'received' ? 'دریافت چک' :
                                     h.status === 'deposited' ? 'واگذاری به بانک (خوابانده)' :
                                     h.status === 'cashed' ? 'وصول/پاس شده' :
                                     h.status === 'bounced' ? 'برگشت خورده' :
                                     h.status === 'returned' ? 'عودت داده شده' :
                                     h.status === 'cancelled' ? 'باطل شده' : h.status
                                   }
                                 </span>
                                 <div dir="ltr" className="flex gap-2 items-center text-gray-500 font-mono text-[10px]">
                                    <span>{formattedTime}</span>
                                    <span>{formattedDate}</span>
                                 </div>
                              </div>
                              <div className="flex justify-between items-start mt-1.5">
                                {h.desc ? (
                                  <p className="text-xs font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed shadow-sm flex-1 ml-4">{h.desc}</p>
                                ) : (
                                  <p className="text-[10px] text-gray-400 italic flex-1 ml-4">بدون توضیحات اضافی</p>
                                )}
                                {h.user && (
                                  <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 shrink-0 mt-1">
                                    <User className="w-3 h-3 text-slate-400" />
                                    <span className="text-[9px] font-bold text-slate-600 truncate max-w-[80px]">{h.user}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                       })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
