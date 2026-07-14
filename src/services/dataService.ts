import { convertToGregorian } from '../utils/format';
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { CompanySettings } from '../types';

const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 0; // Disabled cache to ensure real-time data
const CACHEABLE_KEYS = ['company_profile', 'warehouses', 'financial_years', 'product_categories', 'person_groups'];

export const getLocalData = async <T>(key: string, defaultValue: T, queryParams: Record<string, string | number> = {}, retries = 3): Promise<T> => {
  const qs = new URLSearchParams(Object.entries(queryParams).map(([k, v]) => [k, String(v)])).toString();
  const url = qs ? `/api/data/${key}?${qs}` : `/api/data/${key}`;
  
  if (CACHEABLE_KEYS.includes(key) && !qs) {
    const cached = cache[key];
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      return cached.data;
    }
  }

  try {
    const fetchUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    const finalData = (data !== null && data !== undefined) ? data : defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(finalData)) { return defaultValue; }
    
    if (CACHEABLE_KEYS.includes(key) && !qs) {
      cache[key] = { data: finalData, timestamp: Date.now() };
    }
    return finalData;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getLocalData(key, defaultValue, queryParams, retries - 1);
    }
    console.error(`Error reading ${key} from API`, error);
    if (CACHEABLE_KEYS.includes(key) && cache[key]) {
       return cache[key].data;
    }
    return defaultValue;
  }
};

const invalidateCache = (key: string) => {
  if (cache[key]) {
    delete cache[key];
  }
};

export const getDatabaseLogs = async () => {
  const logs = await getLocalData<any[]>('database_logs', []);
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

export const addDatabaseLog = async (action: string, entityType: string, entityId: string, oldData: any, newData: any) => {
  const logs = await getLocalData<any[]>('database_logs', []);
  
  let userId = 'system';
  if (typeof window !== 'undefined') {
     try {
       const sessionStr = window.localStorage.getItem('auth_user');
       if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session.name) userId = session.name;
          else if (session.username) userId = session.username;
       }
     } catch(e) {}
  }

  const newLog = {
     id: generateId(),
     timestamp: Date.now(),
     action,
     entityType,
     entityId,
     userId,
     oldData: oldData ? JSON.stringify(oldData) : null,
     newData: newData ? JSON.stringify(newData) : null
  };

  logs.unshift(newLog); // Add to beginning
  if (logs.length > 2000) {
     logs.length = 2000;
  }
  
  // Directly save without recursive logging
  try {
    await fetch('/api/data/database_logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logs)
    });
  } catch(e) {}
};

export const appendLocalData = async <T>(key: string, data: T): Promise<T> => {
  const processedData = await ensureFiscalYearId(key, data);
  const res = await fetch(`/api/data/${key}/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(processedData)
  });
  if (!res.ok) throw new Error('Network response was not ok');
  invalidateCache(key);
  const result = await res.json();
  return result.data;
};

const FINANCIAL_KEYS = new Set([
  'receipt_transactions',
  'payment_transactions',
  'transactions',
  'sales_invoices',
  'purchase_invoices',
  'warehouse_receipts',
  'warehouse_remittances',
  'proforma_invoices',
  'sale_returns',
  'purchase_returns',
  'wastes',
  'invoices',
  'accounting_documents',
  'issued_checks',
  'received_checks',
  'checkbooks',
  'check_history',
  'refundRequests',
  'stocktakings',
  'person_opening_balances',
  'loans',
  'installments',
  'payslips',
  'sales_invoice_payments',
  'purchase_invoice_payments',
  'debtors_trackings',
  'InventoryTransactions'
]);

const ensureFiscalYearId = async (key: string, data: any): Promise<any> => {
  if (!data) return data;
  if (!FINANCIAL_KEYS.has(key)) return data;
  try {
    const activeYear = await getActiveFinancialYear();
    if (!activeYear || !activeYear.id) return data;
    
    const yearId = activeYear.id;
    
    if (Array.isArray(data)) {
      return data.map(item => {
        if (item && typeof item === 'object') {
          return { fiscalYearId: item.fiscalYearId || yearId, ...item };
        }
        return item;
      });
    } else if (typeof data === 'object') {
      return { fiscalYearId: data.fiscalYearId || yearId, ...data };
    }
  } catch (e) {
    // ignore
  }
  return data;
};

export const batchLocalData = async (operations: any[]): Promise<any> => {
  const processedOps = [];
  for (const op of operations) {
    if (op.type !== 'delete') {
      const processedData = await ensureFiscalYearId(op.key, op.data);
      processedOps.push({ ...op, data: processedData });
    } else {
      processedOps.push(op);
    }
  }
  const res = await fetch(`/api/data/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operations: processedOps })
  });
  if (!res.ok) throw new Error('Network response was not ok');
  operations.forEach(op => invalidateCache(op.key));
  return await res.json();
};

export const updateLocalData = async <T>(key: string, id: string | number, data: T): Promise<T> => {
  const processedData = await ensureFiscalYearId(key, data);
  const res = await fetch(`/api/data/${key}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(processedData)
  });
  if (!res.ok) throw new Error('Network response was not ok');
  invalidateCache(key);
  const result = await res.json();
  return result.data;
};

export const saveLocalData = async <T>(key: string, data: T, retries = 3): Promise<void> => {
  try {
    const processedData = await ensureFiscalYearId(key, data);
    const res = await fetch(`/api/data/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    });
    if (!res.ok) throw new Error('Network response was not ok');
    invalidateCache(key);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return saveLocalData(key, data, retries - 1);
    }
    console.error(`Error saving ${key} to API`, error);
  }
};

export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


export const updateDocCounter = async (docTypeKey: string, generatedNumber: string | number) => {
    try {
        const settings = await getStoreSettings();
        const prefixKey = `prefix_${docTypeKey}`;
        const prefix = settings && settings[prefixKey as keyof CompanySettings] !== undefined ? String(settings[prefixKey as keyof CompanySettings]) : '';
        
        let valStr = String(generatedNumber || '');
        if (prefix && valStr.startsWith(prefix)) {
            valStr = valStr.substring(prefix.length);
        }
        const val = parseInt(valStr.replace(/\D/g, ''), 10);
        
        if (!isNaN(val)) {
            const counters = await getLocalData<Record<string, number>>('doc_counters', {});
            if (counters[docTypeKey] === undefined || val > counters[docTypeKey]) {
                counters[docTypeKey] = val;
                await saveLocalData('doc_counters', counters);
            }
        }
    } catch (e) {
        console.error('Error updating doc counter', e);
    }
};

// Document Number Generator based on system settings
export const generateDocNumber = async (docTypeKey: string): Promise<string> => {
  try {
    const settings = await getStoreSettings();
    if (!settings) return Date.now().toString().slice(-6);

    const prefixKey = `prefix_${docTypeKey}`;
    const startKey = `start_${docTypeKey}`;
    const lenKey = `len_${docTypeKey}`;

    const prefix = settings[prefixKey as keyof CompanySettings] !== undefined ? String(settings[prefixKey as keyof CompanySettings]) : '';
    const startObj = settings[startKey as keyof CompanySettings];
    const start = startObj && !isNaN(Number(startObj)) ? Number(startObj) : 1000;
    const lenObj = settings[lenKey as keyof CompanySettings];
    const len = lenObj && !isNaN(Number(lenObj)) ? Number(lenObj) : 6;

    const counters = await getLocalData<Record<string, number>>('doc_counters', {});
    
    let nextValue = start;
    if (counters[docTypeKey] !== undefined) {
        nextValue = counters[docTypeKey] + 1;
        if (nextValue < start) {
            nextValue = start;
        }
    } else {
        let items: any[] = [];
        if (docTypeKey === 'sale' || docTypeKey === 'purchase' || docTypeKey.includes('return') || docTypeKey === 'proforma') {
          items = await getInvoices();
          items = items.filter(i => docTypeKey.includes('return') ? i.type === docTypeKey : (docTypeKey === 'sale' ? i.type === 'sale' : i.type === docTypeKey));
        } else if (docTypeKey === 'warehouse_receipt' || docTypeKey === 'warehouse_remittance') {
          items = await getInvoices();
          items = items.filter(i => i.type === docTypeKey);
        } else if (docTypeKey === 'receive_receipt' || docTypeKey === 'pay_receipt' || docTypeKey === 'salary') {
          items = await getTransactions();
          const typeMap: any = { 'receive_receipt': 'receive', 'pay_receipt': 'pay', 'salary': 'salary' };
          items = items.filter(i => i.type === typeMap[docTypeKey]);
        } else if (docTypeKey === 'check_issued') items = await getIssuedChecks();
        else if (docTypeKey === 'check_received') items = await getReceivedChecks();
        else if (docTypeKey === 'person') items = await getPersons();
        else if (docTypeKey === 'product') items = await getProducts();
        else if (docTypeKey === 'accounting_document') items = await getAccountingDocuments();
        else if (docTypeKey === 'loan') items = await getLoans();
        else if (docTypeKey === 'installment') items = await getInstallments();

        let maxExisting = 0;
        let idField = (docTypeKey === 'person' || docTypeKey === 'product') ? 'code' : 
                      (docTypeKey === 'accounting_document' ? 'documentNumber' : 
                      (docTypeKey.includes('receipt') || docTypeKey === 'salary' ? 'receiptNumber' : 'invoiceNumber'));
        
        if (docTypeKey === 'check_issued' || docTypeKey === 'check_received') idField = 'checkNumber';

        items.forEach(item => {
           let valStr = String(item[idField] || '');
           if (prefix && valStr.startsWith(prefix)) {
              valStr = valStr.substring(prefix.length);
           }
           let val = parseInt(valStr.replace(/\D/g, ''), 10);
           if (!isNaN(val) && val > maxExisting) {
               maxExisting = val;
           }
        });
        
        if (maxExisting >= start) {
            nextValue = maxExisting + 1;
        } else {
            nextValue = start;
        }
    }

    counters[docTypeKey] = nextValue;
    await saveLocalData('doc_counters', counters);

    const numStr = String(nextValue).padStart(len, '0');
    return `${prefix}${numStr}`;
    
  } catch (err) {
    return Date.now().toString().slice(-6);
  }
};

export const getStoreSettings = async (): Promise<CompanySettings | null> => {
  return await getLocalData<CompanySettings | null>('company_profile', null);
};

export const saveStoreSettings = async (settings: CompanySettings): Promise<void> => {
  await saveLocalData('company_profile', settings);
};

export const parseToGregorianDate = (dateStr: string | number | Date, calendarType: string): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  let checkDate = new Date(dateStr);
  if (!isNaN(checkDate.getTime())) {
    if (typeof dateStr === 'number' || calendarType === 'gregorian' || checkDate.getFullYear() > 1900) {
      return checkDate;
    }
  }

  try {
    const cleanStr = String(dateStr).replace(/\//g, '-');
    const jalaliDate = new DateObject({
      date: cleanStr,
      format: "YYYY-MM-DD",
      calendar: persian,
      locale: persian_fa
    });
    const d = jalaliDate.toDate();
    if (d && !isNaN(d.getTime())) {
      return d;
    }
  } catch (e) {
    // fallback
  }

  return isNaN(checkDate.getTime()) ? null : checkDate;
};

export const getFinancialYears = async () => {
  return getLocalData<any[]>('financial_years', []);
};

export const saveFinancialYears = async (years: any[]) => {
  await saveLocalData('financial_years', years);
};

export const getActiveFinancialYear = async () => {
  const years = await getFinancialYears();
  return years.find(y => y.status === 'open') || null;
};

export const addFinancialYear = async (year: any) => {
  const years = await getFinancialYears();
  const hasOpen = years.some(y => y.status === 'open');
  if (hasOpen) {
    throw new Error('تا زمانیکه یک سال مالی باز و فعال وجود دارد، نمی‌توان سال مالی جدیدی تعریف کرد.');
  }
  const now = Date.now();
  const newYear = {
    ...year,
    id: generateId(),
    status: 'open',
    createdAt: now,
    updatedAt: now
  };
  years.push(newYear);
  await saveFinancialYears(years);
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_FINANCIAL_YEAR', `تعریف سال مالی جدید: ${newYear.name}`, 'FinancialYear', newYear.id);
  }
  return newYear;
};

export const closeFinancialYear = async (id: string | number) => {
  const years = await getFinancialYears();
  const idx = years.findIndex(y => String(y.id) === String(id));
  if (idx !== -1) {
    years[idx].status = 'closed';
    years[idx].updatedAt = Date.now();
    await saveFinancialYears(years);
    
    if (typeof addSystemLog !== 'undefined') {
      await addSystemLog('CLOSE_FINANCIAL_YEAR', `بستن سال مالی: ${years[idx].name}`, 'FinancialYear', id);
    }
    return years[idx];
  }
  return null;
};

export const checkFinancialYear = async (dateStr: string | number) => {
  if (!dateStr) return null;
  const activeYear = await getActiveFinancialYear();
  if (!activeYear) {
    throw new Error("هیچ سال مالی فعال و بازی در سیستم وجود ندارد. ابتدا یک سال مالی باز ایجاد کنید.");
  }
  
  const settings = await getStoreSettings() as any;
  const calendarType = settings?.calendarType || 'jalali';
  
  const checkDate = parseToGregorianDate(dateStr, calendarType);
  if (!checkDate) return activeYear;
  
  checkDate.setHours(0,0,0,0);
  
  const startDate = parseToGregorianDate(activeYear.startDate, calendarType);
  const endDate = parseToGregorianDate(activeYear.endDate, calendarType);
  
  if (startDate) {
    startDate.setHours(0,0,0,0);
    if (checkDate < startDate) {
      throw new Error(`تاریخ وارد شده (${dateStr}) قبل از شروع سال مالی فعال (${activeYear.startDate}) است.`);
    }
  }
  
  if (endDate) {
    endDate.setHours(23,59,59,999);
    if (checkDate > endDate) {
      throw new Error(`تاریخ وارد شده (${dateStr}) بعد از پایان سال مالی فعال (${activeYear.endDate}) است.`);
    }
  }
  
  return activeYear;
};

// Users
export const getUsers = async () => {
  const users = await getLocalData<any[]>('users', []);
  return users.sort((a, b) => b.createdAt - a.createdAt);
};

export const addUser = async (user: any) => {
  const now = Date.now();
  const newUser = { ...user, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('users', newUser);
  return newUser;
};

export const updateUser = async (id: string, user: any) => {
  return await updateLocalData('users', id, { ...user, updatedAt: Date.now() });
};

export const deleteUser = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'users', id }]);
};

// Person Groups
export const getPersonGroups = async () => {
  const groups = await getLocalData<any[]>('person_groups', []);
  return groups.sort((a, b) => b.createdAt - a.createdAt);
};

export const addPersonGroup = async (group: any) => {
  const now = Date.now();
  const newGroup = { ...group, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('person_groups', newGroup);
  return newGroup;
};

export const updatePersonGroup = async (id: string, group: any) => {
  return await updateLocalData('person_groups', id, { ...group, updatedAt: Date.now() });
};

export const deletePersonGroup = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'person_groups', id }]);
};

// Person Roles
export const getPersonRoles = async () => {
  const roles = await getLocalData<any[]>('person_roles', []);
  if (roles.length === 0) {
    // initialize defaults
    const defaults = [
      { id: 'customer', name: 'مشتری', code: '10', color: 'bg-emerald-50 text-emerald-800 border-emerald-100', createdAt: Date.now() },
      { id: 'supplier', name: 'تامین کننده', code: '20', color: 'bg-orange-50 text-orange-850 border-orange-100', createdAt: Date.now() },
      { id: 'employee', name: 'کارمند', code: '30', color: 'bg-purple-50 text-purple-800 border-purple-100', createdAt: Date.now() }
    ];
    await saveLocalData('person_roles', defaults);
    return defaults;
  }
  return roles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const addPersonRole = async (role: any) => {
  const now = Date.now();
  const newRole = { ...role, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('person_roles', newRole);
  return newRole;
};

export const updatePersonRole = async (id: string, role: any) => {
  return await updateLocalData('person_roles', id, { ...role, updatedAt: Date.now() });
};

export const deletePersonRole = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'person_roles', id }]);
};

// Persons

export const getPersonContacts = async () => {
  return await getLocalData<any[]>('person_contacts', []);
};

export const savePersonContacts = async (contacts: any[]) => {
  await saveLocalData('person_contacts', contacts);
};

export const getPersonBankAccounts = async () => {
  return await getLocalData<any[]>('person_bank_accounts', []);
};

export const savePersonBankAccounts = async (accounts: any[]) => {
  await saveLocalData('person_bank_accounts', accounts);
};

export const getPersons = async () => {
  const persons = await getLocalData<any[]>('persons', []);
  const contacts = await getLocalData<any[]>('person_contacts', []);
  const bankAccounts = await getLocalData<any[]>('person_bank_accounts', []);
  
  const formattedPersons = (persons || []).map(p => {
     p.contacts = contacts.filter(c => String(c.personId) === String(p.id));
     p.bankAccounts = bankAccounts.filter(b => String(b.personId) === String(p.id));
     return p;
  });
  
  return formattedPersons.filter(p => !p.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};

export const addPerson = async (person: any) => {
  const persons = await getLocalData<any[]>('persons', []);
  const roles = await getPersonRoles();
  
  const roleId = person.role;
  const roleObj = roles.find(r => r.id === roleId); // Try to find dynamic role
  
  // if not found, maybe fallback to standard code mapping '10', '20', '30'
  let roleCodePrefix = '10';
  if (roleObj && roleObj.code) {
    roleCodePrefix = roleObj.code;
  } else if (roleId === 'supplier') {
    roleCodePrefix = '20';
  } else if (roleId === 'employee') {
    roleCodePrefix = '30';
  }
  
  let maxSuffix = 0;
  for (const p of persons) {
    if (p.role === roleId && p.personCode && p.personCode.startsWith(roleCodePrefix)) {
      const suffix = Number(p.personCode.substring(roleCodePrefix.length));
      if (!isNaN(suffix) && suffix > maxSuffix) {
        maxSuffix = suffix;
      }
    }
  }

  const nextSuffix = (maxSuffix + 1).toString().padStart(4, '0'); // e.g. 0001
  let finalPersonCode = `${roleCodePrefix}${nextSuffix}`;

  // Check if there is specific configuration for Person Code in settings
  const settings = await getStoreSettings();
  if (settings && (settings as any).prefix_person !== undefined) {
    finalPersonCode = await generateDocNumber('person');
  }

  // --- Handle Ledger Accounts for the Person ---
  let parentCode = '12';
  let parentNature = 'debit';
  let subsidiaryCode = '1201';
  let subAccTitle = 'مشتریان';
  if (roleId === 'supplier') {
    parentCode = '21';
    parentNature = 'credit';
    subsidiaryCode = '2101';
    subAccTitle = 'تامین‌کنندگان';
  } else if (roleId === 'employee') {
    parentCode = '21';
    parentNature = 'credit';
    subsidiaryCode = '2102';
    subAccTitle = 'کارکنان';
  }
  
  let finalAccountingCode = await ensureLedgerAccount(
    person,
    parentCode,
    subsidiaryCode,
    subAccTitle,
    person.alias || person.name,
    parentNature
  );

  const now = Date.now();
  const { contacts, bankAccounts, ...personData } = person;
  const newPerson = { ...personData, personCode: finalPersonCode, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('persons', newPerson);
  
  if (contacts && contacts.length > 0) {
      const allContacts = await getLocalData<any[]>('person_contacts', []);
      await saveLocalData('person_contacts', [...allContacts, ...contacts.map((c: any) => ({...c, personId: newPerson.id}))]);
  }
  if (bankAccounts && bankAccounts.length > 0) {
      const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
      await saveLocalData('person_bank_accounts', [...allBanks, ...bankAccounts.map((b: any) => ({...b, personId: newPerson.id}))]);
  }

  if (newPerson.personCode) {
      await updateDocCounter('person', newPerson.personCode);
  }
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'Person'.toUpperCase(), 'ثبت رکورد جدید در persons', 'Person', newPerson.id);
  }

  return newPerson;
};

export const updatePerson = async (id: string, person: any) => {
  if (person.personCode) {
      await updateDocCounter('person', person.personCode);
  }
  const persons = await getLocalData<any[]>('persons', []);
  const index = persons.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    const oldPerson = persons[index];
    const { contacts, bankAccounts, ...personData } = person;
    const updatedPerson = { ...oldPerson, ...personData, updatedAt: Date.now() };

    if (contacts) {
       const allContacts = await getLocalData<any[]>('person_contacts', []);
       const filteredContacts = allContacts.filter(c => String(c.personId) !== String(id));
       await saveLocalData('person_contacts', [...filteredContacts, ...contacts.map((c: any) => ({...c, personId: id}))]);
    }

    if (bankAccounts) {
       const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
       const filteredBanks = allBanks.filter(b => String(b.personId) !== String(id));
       await saveLocalData('person_bank_accounts', [...filteredBanks, ...bankAccounts.map((b: any) => ({...b, personId: id}))]);
    }

    // Ensure Ledger Account exists
    let parentCode = '12';
    let parentNature = 'debit';
    const roleId = updatedPerson.role;
    let subsidiaryCode = '1201';
    let subAccTitle = 'مشتریان';
    if (roleId === 'supplier') {
      parentCode = '21';
      parentNature = 'credit';
      subsidiaryCode = '2101';
      subAccTitle = 'تامین‌کنندگان';
    } else if (roleId === 'employee') {
      parentCode = '21';
      parentNature = 'credit';
      subsidiaryCode = '2102';
      subAccTitle = 'کارکنان';
    }
    
    let finalAccountingCode = await ensureLedgerAccount(
      updatedPerson,
      parentCode,
      subsidiaryCode,
      subAccTitle,
      updatedPerson.alias || updatedPerson.name,
      parentNature
    );
    updatedPerson.accountingCode = finalAccountingCode;

    await updateLocalData('persons', id, updatedPerson);
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('UPDATE_' + 'Person'.toUpperCase(), 'ویرایش رکورد در persons', 'Person', id);
  }

    return updatedPerson;
  }
  return null;
};

export const deletePerson = async (id: string) => {
  // Check relations
  const invoices = await getInvoices();
  if (invoices.some(inv => String(inv.customerId) === String(id))) {
    throw new Error('این شخص دارای فاکتور ثبت شده است و قابل حذف نیست.');
  }
  const transactions = await getTransactions();
  if (transactions.some(t => String(t.personId) === String(id))) {
    throw new Error('این شخص دارای سند دریافت/پرداخت است و قابل حذف نیست.');
  }
  const issuedChecks = await getIssuedChecks();
  if (issuedChecks.some(c => String(c.payeeId) === String(id))) {
    throw new Error('این شخص دارای چک پرداختی است و قابل حذف نیست.');
  }
  const receivedChecks = await getReceivedChecks();
  if (receivedChecks.some(c => String(c.payerId) === String(id))) {
    throw new Error('این شخص دارای چک دریافتی است و قابل حذف نیست.');
  }

  const persons = await getLocalData<any[]>('persons', []);
  // Instead of physical delete, maybe just soft delete if needed, but user says "هیچ چیز به صورت فیزیکی حذف نشود".
  // Actually, we can do soft delete by setting isDeleted = true. Or just keep it as is if there are no relations, we can physically delete it, since it has no relations. The user says "هیچ چیز به صورت فیزیکی حذف نشود". So let's soft delete.
  const index = persons.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    persons[index].isDeleted = true;
    await updateLocalData('persons', id, persons[index]);
  }
};

// Accounts
export const ensureLedgerAccount = async (
  entity: any,
  parentCode: string,
  subsidiaryCode: string,
  subsidiaryTitle: string,
  entityTitle: string,
  nature: string
) => {
  let finalAccountingCode = entity.accountingCode;
  const ledgerAccounts = await getLedgerAccounts();
  
  const parentGeneralAcc = ledgerAccounts.find(a => a.code === parentCode);
  if (!parentGeneralAcc) return finalAccountingCode;

  let subAcc = ledgerAccounts.find(a => a.code === subsidiaryCode);
  if (!subAcc) {
    subAcc = { id: generateId(), code: subsidiaryCode, title: subsidiaryTitle, type: 'subsidiary', nature, parentId: parentGeneralAcc.id };
    await addLedgerAccount(subAcc);
    ledgerAccounts.push(subAcc);
  }

  if (!finalAccountingCode || String(finalAccountingCode).trim() === '') {
    let maxAccSuffix = 0;
    ledgerAccounts.forEach(a => {
      if (a.code && a.code.startsWith(subsidiaryCode) && a.code.length > subsidiaryCode.length) {
        const s = Number(a.code.substring(subsidiaryCode.length));
        if (!isNaN(s) && s > maxAccSuffix) maxAccSuffix = s;
      }
    });
    finalAccountingCode = `${subsidiaryCode}${(maxAccSuffix + 1).toString().padStart(4, '0')}`;
    
    const newEntityLedger = {
      id: generateId(),
      code: finalAccountingCode,
      title: entityTitle,
      type: 'detailed',
      nature,
      parentId: subAcc.id
    };
    await addLedgerAccount(newEntityLedger);
  } else {
    const existingAcc = ledgerAccounts.find(a => a.code === finalAccountingCode);
    if (existingAcc && existingAcc.title !== entityTitle) {
      await updateLedgerAccount(existingAcc.id, { ...existingAcc, title: entityTitle });
    }
  }

  return finalAccountingCode;
};

export const getAccounts = async () => {
  const accounts = await getLocalData<any[]>('accounts', []);
  let modified = false;
  for (let i = 0; i < (accounts || []).length; i++) {
    if (!accounts[i].accountingCode || String(accounts[i].accountingCode).trim() === '') {
      accounts[i].accountingCode = await ensureLedgerAccount(
        accounts[i],
        '11',
        '1102',
        'بانک‌ها',
        accounts[i].bankName + ' - ' + (accounts[i].branchName || ''),
        'debit'
      );
      modified = true;
    }
  }
  if (modified) {
    await saveLocalData('accounts', accounts);
  }
  return accounts.sort((a, b) => b.createdAt - a.createdAt);
};

export const addAccount = async (account: any) => {
  const now = Date.now();
  let finalAccountingCode = await ensureLedgerAccount(account, '11', '1102', 'بانک‌ها', account.bankName + ' - ' + (account.branchName || ''), 'debit');
  const newAccount = { ...account, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('accounts', newAccount);
  return newAccount;
};

export const updateAccount = async (id: string, account: any) => {
  const accounts = await getLocalData<any[]>('accounts', []);
  const oldAccount = accounts.find((p: any) => String(p.id) === String(id));
  if (oldAccount) {
    const mergedAccount = { ...oldAccount, ...account };
    let finalAccountingCode = await ensureLedgerAccount(mergedAccount, '11', '1102', 'بانک‌ها', mergedAccount.bankName + ' - ' + (mergedAccount.branchName || ''), 'debit');
    return await updateLocalData('accounts', id, { ...mergedAccount, accountingCode: finalAccountingCode, updatedAt: Date.now() });
  }
  return null;
};

export const deleteAccount = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'accounts', id }]);
};

// Cashboxes
export const getCashboxes = async () => {
  const cashboxes = await getLocalData<any[]>('cashboxes', []);
  let modified = false;
  for (let i = 0; i < (cashboxes || []).length; i++) {
    if (!cashboxes[i].accountingCode || String(cashboxes[i].accountingCode).trim() === '') {
      cashboxes[i].accountingCode = await ensureLedgerAccount(
        cashboxes[i],
        '11',
        '1101',
        'صندوق‌ها',
        cashboxes[i].name,
        'debit'
      );
      modified = true;
    }
  }
  if (modified) {
    await saveLocalData('cashboxes', cashboxes);
  }
  return cashboxes.sort((a, b) => b.createdAt - a.createdAt);
};

export const addCashbox = async (cashbox: any) => {
  const now = Date.now();
  let finalAccountingCode = await ensureLedgerAccount(cashbox, '11', '1101', 'صندوق‌ها', cashbox.name, 'debit');
  const newCashbox = { ...cashbox, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('cashboxes', newCashbox);
  return newCashbox;
};

export const updateCashbox = async (id: string, cashbox: any) => {
  const cashboxes = await getLocalData<any[]>('cashboxes', []);
  const oldCashbox = cashboxes.find((p: any) => String(p.id) === String(id));
  if (oldCashbox) {
    const mergedCashbox = { ...oldCashbox, ...cashbox };
    let finalAccountingCode = await ensureLedgerAccount(mergedCashbox, '11', '1101', 'صندوق‌ها', mergedCashbox.name, 'debit');
    return await updateLocalData('cashboxes', id, { ...mergedCashbox, accountingCode: finalAccountingCode, updatedAt: Date.now() });
  }
  return null;
};

export const deleteCashbox = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'cashboxes', id }]);
};

// Warehouses
export const getWarehouses = async () => {
  const warehouses = await getLocalData<any[]>('warehouses', []);
  return (warehouses || []).filter(w => !w.isDeleted).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const addWarehouse = async (warehouse: any) => {
  const now = Date.now();
  const newWarehouse = { ...warehouse, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('warehouses', newWarehouse);
  return newWarehouse;
};

export const updateWarehouse = async (id: string, warehouse: any) => {
  return await updateLocalData('warehouses', id, { ...warehouse, updatedAt: Date.now() });
};

export const deleteWarehouse = async (id: string) => {
  const invoices = await getInvoices();
  if (invoices.some(inv => String(inv.warehouseId) === String(id))) {
     throw new Error('این انبار در اسناد یا فاکتورها استفاده شده است و قابل حذف نیست.');
  }
  await batchLocalData([{ type: 'delete', key: 'warehouses', id }]);
};

// Product Categories
export const getProductCategories = async () => {
  const categories = await getLocalData<any[]>('product_categories', []);
  return categories.sort((a, b) => b.createdAt - a.createdAt);
};

export const addProductCategory = async (category: any) => {
  const categories = await getLocalData<any[]>('product_categories', []);
  const now = Date.now();
  
  let maxCatCode = 0;
  for (let i = 0; i < (categories || []).length; i++) {
    const c = categories[i];
    if (c.code) {
      const num = parseInt(c.code, 10);
      if (!isNaN(num) && num > maxCatCode) maxCatCode = num;
    } else {
      const idx = i + 1;
      if (idx > maxCatCode) maxCatCode = idx;
    }
  }
  const catCode = (maxCatCode + 1).toString().padStart(2, '0');

  const newCategory = { ...category, code: catCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('product_categories', newCategory);
  return newCategory;
};

export const updateProductCategory = async (id: string, category: any) => {
  return await updateLocalData('product_categories', id, { ...category, updatedAt: Date.now() });
};

export const deleteProductCategory = async (id: string) => {
  await batchLocalData([{ type: 'delete', key: 'product_categories', id }]);
};

// Products
export const getProducts = async () => {
  const products = await getLocalData<any[]>('products', []);
  return (products || []).filter(p => !p.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};

export const addProduct = async (product: any) => {
  const products = await getLocalData<any[]>('products', []);
  const categories = await getLocalData<any[]>('product_categories', []);
  const now = Date.now();

  let newCode = product.code;
  if (!newCode && product.categoryId) {
    const catIndex = categories.findIndex(c => String(c.id) === String(product.categoryId));
    const category = categories[catIndex];
    let catCode = category?.code;
    if (!catCode && catIndex !== -1) {
      catCode = (catIndex + 1).toString().padStart(2, '0');
    } else if (!catCode) {
      catCode = '00';
    }

    const catProducts = products.filter(p => String(p.categoryId) === String(product.categoryId));
    let maxNum = 0;
    for(const p of catProducts) {
      if (p.code && typeof p.code === 'string' && p.code.startsWith(`${catCode}-`)) {
        const numStr = p.code.replace(`${catCode}-`, '');
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
    maxNum++;
    newCode = `${catCode}-${maxNum.toString().padStart(3, '0')}`;
  } else if (!newCode) {
    // If no category is chosen, use '00' prefix
    let maxNum = 0;
    const catProducts = products.filter(p => !p.categoryId || p.categoryId === '');
    for(const p of catProducts) {
      if (p.code && typeof p.code === 'string' && p.code.startsWith(`00-`)) {
        const numStr = p.code.replace(`00-`, '');
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
    maxNum++;
    newCode = `00-${maxNum.toString().padStart(3, '0')}`;
  }
  
  // Check if there is specific configuration for Product Code in settings
  const settings = await getStoreSettings();
  if (settings && (settings as any).prefix_product !== undefined) {
    newCode = await generateDocNumber('product');
  }

  const newProduct = { ...product, code: newCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('products', newProduct);
  
  if (newProduct.code) {
      await updateDocCounter('product', newProduct.code);
  }

  const purchasePrice = Number(newProduct.purchasePrice || newProduct.buyPrice || 0);
  const salePrice = Number(newProduct.price || newProduct.sellPrice || 0);
  const priceChangeDate = newProduct.priceChangeDate || new Date().toISOString();
  
  if (purchasePrice > 0) {
      await appendLocalData('product_price_history', {
          id: generateId(),
          productId: newProduct.id,
          date: priceChangeDate,
          type: 'purchase',
          price: purchasePrice
      });
  }
  if (salePrice > 0) {
      await appendLocalData('product_price_history', {
          id: generateId(),
          productId: newProduct.id,
          date: priceChangeDate,
          type: 'sale',
          price: salePrice
      });
  }
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'Product'.toUpperCase(), 'ثبت رکورد جدید در products', 'Product', newProduct.id);
  }

  return newProduct;
};

export const updateProduct = async (id: string, product: any) => {
  const products = await getLocalData<any[]>('products', []);
  const index = products.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    const oldProduct = products[index];
    const newProduct = { ...oldProduct, ...product, updatedAt: Date.now() };
    
    const newBuy = Number(newProduct.purchasePrice || newProduct.buyPrice || 0);
    const newSell = Number(newProduct.price || newProduct.sellPrice || 0);
    const oldBuy = Number(oldProduct.purchasePrice || oldProduct.buyPrice || 0);
    const oldSell = Number(oldProduct.price || oldProduct.sellPrice || 0);
    
    const priceChangeDate = newProduct.priceChangeDate || new Date().toISOString();
    
    if (newBuy !== oldBuy && newBuy > 0) {
        await appendLocalData('product_price_history', {
            id: generateId(),
            productId: newProduct.id,
            date: priceChangeDate,
            type: 'purchase',
            price: newBuy
        });
    }
    if (newSell !== oldSell && newSell > 0) {
        await appendLocalData('product_price_history', {
            id: generateId(),
            productId: newProduct.id,
            date: priceChangeDate,
            type: 'sale',
            price: newSell
        });
    }

    const updated = await updateLocalData('products', id, newProduct);
  
    if (typeof addSystemLog !== 'undefined') {
      await addSystemLog('UPDATE_' + 'Product'.toUpperCase(), 'ویرایش کالا', 'Product', updated.id);
    }
    return updated;
  }
  return null;
};

export const deleteProduct = async (id: string) => {
  const products = await getLocalData<any[]>('products', []);
  await saveLocalData('products', products.filter((p: any) => String(p.id) !== String(id)));
};

const mapTransactionTypeToTable = (type: string) => {
  if (type === 'receive') return 'receipt_transactions';
  return 'payment_transactions';
};


export const syncInvoiceAllocations = async (tx: any) => {
    if (!tx || !tx.id || !tx.linkedInvoices) return;
    try {
        const now = new Date().toISOString();
        const salesPayments = await getLocalData<any[]>('sales_invoice_payments', []);
        const purchasePayments = await getLocalData<any[]>('purchase_invoice_payments', []);
        const invoices = await getInvoices();
        
        let salesChanged = false;
        let purchaseChanged = false;

        const newSales = salesPayments.filter(p => String(p.receiptId) !== String(tx.id));
        const newPurchases = purchasePayments.filter(p => String(p.receiptId) !== String(tx.id));

        for (const invId of Object.keys(tx.linkedInvoices)) {
            const amount = Number(tx.linkedInvoices[invId]) || 0;
            if (amount <= 0) continue;
            
            const inv = invoices.find(i => String(i.id) === String(invId));
            if (!inv) continue;

            const record = {
                id: `${tx.id}_${invId}`,
                invoiceId: invId,
                receiptId: tx.id,
                amount: amount,
                date: tx.date || now.split('T')[0],
                timestamp: now
            };

            if (inv.type === 'purchase' || inv.type === 'purchase_return') {
                newPurchases.push(record);
                purchaseChanged = true;
            } else {
                newSales.push(record);
                salesChanged = true;
            }
        }
        
        // Always save to ensure deleted allocations are actually removed
        if (salesChanged || salesPayments.length !== newSales.length) {
            await saveLocalData('sales_invoice_payments', newSales);
        }
        if (purchaseChanged || purchasePayments.length !== newPurchases.length) {
            await saveLocalData('purchase_invoice_payments', newPurchases);
        }

    } catch (e) {
        console.error('Error syncing invoice allocations:', e);
    }
};

export const getSalesInvoicePayments = async () => {
  return await getLocalData<any[]>('sales_invoice_payments', []);
};

export const getPurchaseInvoicePayments = async () => {
  return await getLocalData<any[]>('purchase_invoice_payments', []);
};
export const getTransactions = async () => {
  let allTx: any[] = [];
  const tables = ['receipt_transactions', 'payment_transactions', 'transactions'];
  for (const table of tables) {
    try {
      const data = await getLocalData<any[]>(table, []);
      if (Array.isArray(data)) {
        allTx = allTx.concat(data);
      }
    } catch (e) {
      // ignore table not existing errors
    }
  }
  return (allTx || []).filter(t => t && !t.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};

export const addTransaction = async (transaction: any) => {
  let activeYear = null; if (transaction.date) activeYear = await checkFinancialYear(transaction.date);
  const now = Date.now();
  
  let finalTx = { ...transaction };
  if (!finalTx.receiptNumber) {
     const docTypeMap: any = { 'receive': 'receive_receipt', 'pay': 'pay_receipt', 'salary': 'salary' };
     if (docTypeMap[finalTx.type]) {
        finalTx.receiptNumber = await generateDocNumber(docTypeMap[finalTx.type]);
     }
  }

  const newTransaction = { ...finalTx, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  const operations: any[] = [];

  if (transaction.type === 'receive' || transaction.type === 'pay' || transaction.type === 'salary') {
    const amount = Number(transaction.amount) || 0;
    if (transaction.resourceType === 'bank') {
      const accounts = await getLocalData<any[]>('accounts', []);
      const index = accounts.findIndex(a => a.id === transaction.resourceId);
      if (index !== -1) {
        let newBalance = accounts[index].balance;
        if (transaction.type === 'receive') {
          newBalance += amount;
        } else {
          newBalance -= amount;
        }
        operations.push({ type: 'update', key: 'accounts', id: accounts[index].id, data: { balance: newBalance } });
      }
    } else if (transaction.resourceType === 'cashbox') {
      const cashboxes = await getLocalData<any[]>('cashboxes', []);
      const index = cashboxes.findIndex(c => c.id === transaction.resourceId);
      if (index !== -1) {
        let newBalance = cashboxes[index].balance;
        if (transaction.type === 'receive') {
          newBalance += amount;
        } else {
          newBalance -= amount;
        }
        operations.push({ type: 'update', key: 'cashboxes', id: cashboxes[index].id, data: { balance: newBalance } });
      }
    }
  }

  const table = mapTransactionTypeToTable(newTransaction.type);
  operations.push({ type: 'append', key: table, data: newTransaction });
  await batchLocalData(operations);
  
  if (newTransaction.receiptNumber) {
     const docTypeMap: any = { 'receive': 'receive_receipt', 'pay': 'pay_receipt', 'salary': 'salary' };
     if (docTypeMap[newTransaction.type]) {
         await updateDocCounter(docTypeMap[newTransaction.type], newTransaction.receiptNumber);
     }
  }

  // Auto-generate detailed accounting document with full explanation
  try {
     const docType = transaction.type === 'receive' ? 'receipt' : 'payment';
     const ledgerAccounts = await getLedgerAccounts();
     const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';

     // Find Person Ledger Account
     let personLedgerId = defaultLedger;
     let personName = 'نامشخص';
     if (transaction.personId) {
        const persons = await getLocalData<any[]>('persons', []);
        const person = persons.find(p => String(p.id) === String(transaction.personId));
        if (person) {
           personName = person.name || person.alias || 'نامشخص';
           if (person.accountingCode) {
              const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
              if (acc) personLedgerId = acc.id;
           }
        }
     }

     // Find Bank/Cashbox Resource Ledger Account
     let resourceLedgerId = defaultLedger;
     let resourceName = 'نامشخص';
     const resType = transaction.resourceType || (transaction.accountId ? 'bank' : transaction.cashboxId ? 'cashbox' : '');
     const isCheckCashing = transaction.isCheckCashing === true;
     const resId = transaction.resourceId || transaction.accountId || transaction.cashboxId;

     if (resType === 'bank' && resId) {
        const accountsList = await getLocalData<any[]>('accounts', []);
        const account = accountsList.find(a => String(a.id) === String(resId));
        if (account) {
           resourceName = account.title || account.bankName || 'نامشخص';
           if (account.accountingCode) {
              const acc = ledgerAccounts.find(a => a.code === account.accountingCode);
              if (acc) resourceLedgerId = acc.id;
           } else {
              const acc = ledgerAccounts.find(a => a.code === '1102');
              if (acc) resourceLedgerId = acc.id;
           }
        }
     } else if (resType === 'cashbox' && resId) {
        const cashboxesList = await getLocalData<any[]>('cashboxes', []);
        const cashbox = cashboxesList.find(c => String(c.id) === String(resId));
        if (cashbox) {
           resourceName = cashbox.name || 'نامشخص';
           if (cashbox.accountingCode) {
              const acc = ledgerAccounts.find(a => a.code === cashbox.accountingCode);
              if (acc) resourceLedgerId = acc.id;
           } else {
              const acc = ledgerAccounts.find(a => a.code === '1101');
              if (acc) resourceLedgerId = acc.id;
           }
        }
     } else {
        const acc = ledgerAccounts.find(a => a.code === '11');
        if (acc) resourceLedgerId = acc.id;
     }

     const formattedAmount = Number(transaction.amount || 0).toLocaleString('fa-IR');
     const sysSettings = await getStoreSettings();
     const currency = transaction.currency || sysSettings?.currency || 'تومان';
     const typeText = transaction.type === 'receive' ? 'دریافت' : transaction.type === 'salary' ? 'حقوق و دستمزد' : 'پرداخت';
     let methodText = 'نقدی';
     if (transaction.method === 'check') methodText = 'چک';
     else if (transaction.method === 'transfer' || transaction.method === 'card') methodText = 'حواله/کارت به کارت';
     let docDescription = '';
     if (transaction.type === 'salary') {
         if (transaction.description && !transaction.description.includes('isPayslip')) {
            docDescription = `${transaction.description} برای کارمند: ${personName}`;
         } else {
            docDescription = `حقوق و دستمزد به مبلغ ${formattedAmount} ${currency} برای کارمند: ${personName}`;
         }
     } else {
         docDescription = `${typeText} ${methodText} به مبلغ ${formattedAmount} ${currency}`;
         if (personName && personName !== 'نامشخص') {
            if (transaction.type === 'receive') {
               docDescription += ` از طرف حساب: ${personName}`;
            } else {
               docDescription += ` به طرف حساب: ${personName}`;
            }
         }
         if (resourceName && resourceName !== 'نامشخص') {
            if (transaction.type === 'receive') {
               docDescription += ` - واریز به حساب/صندوق: ${resourceName}`;
            } else {
               docDescription += ` - برداشت از حساب/صندوق: ${resourceName}`;
            }
         }
     }
          
     if (newTransaction.receiptNumber) {
        docDescription += ` (شماره سند/رسید: ${newTransaction.receiptNumber})`;
     }
     if (transaction.method === 'check' && transaction.checkNumber) {
        docDescription += ` - چک شماره ${transaction.checkNumber}`;
        if (transaction.checkDueDate) docDescription += ` به سررسید ${transaction.checkDueDate}`;
        if (transaction.checkBankName) docDescription += ` عهده بانک ${transaction.checkBankName}`;
     }
     if (transaction.description) {
        let appendedDesc = transaction.description;
        if (transaction.type === 'salary') {
            try {
                const p = JSON.parse(transaction.description);
                if (p.isPayslip) {
                    const pMonthName = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
                    const mName = p.periodMonth ? pMonthName[parseInt(p.periodMonth, 10) - 1] : "";
                    docDescription = `سند حقوق ${mName} ماه ${p.periodYear} - ${personName}`;
                    if (newTransaction.receiptNumber) {
                        docDescription += ` (شماره فیش: ${newTransaction.receiptNumber})`;
                    }
                    appendedDesc = p.userNote || "";
                }
            } catch(e) {}
        }
        if (appendedDesc && appendedDesc !== transaction.description) {
           docDescription += ` [توضیحات: ${appendedDesc}]`;
        } else if (appendedDesc && transaction.type !== 'salary') {
           docDescription += ` [توضیحات: ${appendedDesc}]`;
        }
     }

     const items = [];
     if (transaction.method === 'check') {
         return newTransaction; // Check accounting is fully handled by syncCheckAccountingDocument
     } else {
         if (transaction.type === 'receive') {
            items.push({
               description: `دریافت وجه به مبلغ ${formattedAmount} واریز به ${resourceName} بابت رسید دریافت شماره ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: Number(transaction.amount),
               credit: 0,
               ledgerAccountId: resourceLedgerId});
            items.push({
               description: `طرف حساب ${personName} به مبلغ ${formattedAmount} بابت رسید دریافت شماره ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: 0,
               credit: Number(transaction.amount),
               ledgerAccountId: personLedgerId,
               detailedAccountId: transaction.personId});
         } else if (transaction.type === 'salary') {
            const expenseAcc = ledgerAccounts.find((a: any) => a.code === '52') || ledgerAccounts.find((a: any) => a.code === '5') || { id: defaultLedger };
            items.push({
               description: `هزینه حقوق و دستمزد کارمند ${personName} بابت فیش حقوقی شماره ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: Number(transaction.amount),
               credit: 0,
               ledgerAccountId: expenseAcc.id});
            items.push({
               description: `طرف حساب ${personName} بابت حقوق و دستمزد شماره فیش ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: 0,
               credit: Number(transaction.amount),
               ledgerAccountId: personLedgerId,
               detailedAccountId: transaction.personId});
         } else {
            items.push({
               description: `طرف حساب ${personName} به مبلغ ${formattedAmount} بابت رسید پرداخت شماره ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: Number(transaction.amount),
               credit: 0,
               ledgerAccountId: personLedgerId,
               detailedAccountId: transaction.personId});
            items.push({
               description: `پرداخت وجه به مبلغ ${formattedAmount} از ${resourceName} بابت رسید شماره ${newTransaction.receiptNumber || newTransaction.id}`,
               debit: 0,
               credit: Number(transaction.amount),
               ledgerAccountId: resourceLedgerId});
         }
     }
     await addAccountingDocument({
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: docDescription,
        status: 'approved',
        sourceType: docType,
        sourceId: newTransaction.id,
        items});
  } catch(e) {}

    await syncInvoiceAllocations(newTransaction);
  return newTransaction;
};

export const updateTransaction = async (id: string | number, updated: any) => {
  let activeYear = null;
  if (updated.date) activeYear = await checkFinancialYear(updated.date);
  const updatedData = { ...updated, updatedAt: Date.now() };
  if (activeYear) updatedData.fiscalYearId = activeYear.id;
  try {
     const table = mapTransactionTypeToTable(updatedData.type);
     const newTx = await updateLocalData(table, id, updatedData);
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'Transaction'.toUpperCase(), `ویرایش رکورد در ${table}`, 'Transaction', newTx.id);
     }

     // Auto-update corresponding accounting document
     try {
       const accountingDocs = await getAccountingDocuments();
       const existingDoc = accountingDocs.find((d: any) => (d.sourceType === 'receipt' || d.sourceType === 'payment') && String(d.sourceId) === String(id));
       
       if (existingDoc) {
         const ledgerAccounts = await getLedgerAccounts();
         const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';

         // Find Person Ledger Account
         let personLedgerId = defaultLedger;
         let personName = 'نامشخص';
         if (updated.personId) {
            const persons = await getLocalData<any[]>('persons', []);
            const person = persons.find(p => String(p.id) === String(updated.personId));
            if (person) {
               personName = person.name || person.alias || 'نامشخص';
               if (person.accountingCode) {
                  const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
                  if (acc) personLedgerId = acc.id;
               }
            }
         }

         // Find Bank/Cashbox Resource Ledger Account
         let resourceLedgerId = defaultLedger;
         let resourceName = 'نامشخص';
         const resType = updated.resourceType || (updated.accountId ? 'bank' : updated.cashboxId ? 'cashbox' : '');
         const resId = updated.resourceId || updated.accountId || updated.cashboxId;

         if (resType === 'bank' && resId) {
            const accountsList = await getLocalData<any[]>('accounts', []);
            const account = accountsList.find(a => String(a.id) === String(resId));
            if (account) {
               resourceName = account.title || account.bankName || 'نامشخص';
               if (account.accountingCode) {
                  const acc = ledgerAccounts.find(a => a.code === account.accountingCode);
                  if (acc) resourceLedgerId = acc.id;
               } else {
                  const acc = ledgerAccounts.find(a => a.code === '1102');
                  if (acc) resourceLedgerId = acc.id;
               }
            }
         } else if (resType === 'cashbox' && resId) {
            const cashboxesList = await getLocalData<any[]>('cashboxes', []);
            const cashbox = cashboxesList.find(c => String(c.id) === String(resId));
            if (cashbox) {
               resourceName = cashbox.name || 'نامشخص';
               if (cashbox.accountingCode) {
                  const acc = ledgerAccounts.find(a => a.code === cashbox.accountingCode);
                  if (acc) resourceLedgerId = acc.id;
               } else {
                  const acc = ledgerAccounts.find(a => a.code === '1101');
                  if (acc) resourceLedgerId = acc.id;
               }
            }
         } else {
            const acc = ledgerAccounts.find(a => a.code === '11');
            if (acc) resourceLedgerId = acc.id;
         }

         const formattedAmount = Number(updated.amount || 0).toLocaleString('fa-IR');
         const sysSettings = await getStoreSettings();
         const currency = updated.currency || sysSettings?.currency || 'تومان';
         const typeText = updated.type === 'receive' ? 'دریافت' : updated.type === 'salary' ? 'حقوق و دستمزد' : 'پرداخت';
         let methodText = 'نقدی';
         if (updated.method === 'check') methodText = 'چک';
         else if (updated.method === 'transfer' || updated.method === 'card') methodText = 'حواله/کارت به کارت';
         let docDescription = '';
         if (updated.type === 'salary') {
             if (updated.description && !updated.description.includes('isPayslip')) {
                docDescription = `${updated.description} برای کارمند: ${personName}`;
             } else {
                docDescription = `حقوق و دستمزد به مبلغ ${formattedAmount} ${currency} برای کارمند: ${personName}`;
             }
         } else {
             docDescription = `${typeText} ${methodText} به مبلغ ${formattedAmount} ${currency}`;
             if (personName && personName !== 'نامشخص') {
                if (updated.type === 'receive') {
                   docDescription += ` از طرف حساب: ${personName}`;
                } else {
                   docDescription += ` به طرف حساب: ${personName}`;
                }
             }
             if (resourceName && resourceName !== 'نامشخص') {
                if (updated.type === 'receive') {
                   docDescription += ` - واریز به حساب/صندوق: ${resourceName}`;
                } else {
                   docDescription += ` - برداشت از حساب/صندوق: ${resourceName}`;
                }
             }
         }
         if (newTx.receiptNumber) {
            docDescription += ` (شماره سند/رسید: ${newTx.receiptNumber})`;
         }
         if (updated.method === 'check' && updated.checkNumber) {
            docDescription += ` - چک شماره ${updated.checkNumber}`;
            if (updated.checkDueDate) docDescription += ` به سررسید ${updated.checkDueDate}`;
            if (updated.checkBankName) docDescription += ` عهده بانک ${updated.checkBankName}`;
         }
         if (updated.description) {
            docDescription += ` [توضیحات: ${updated.description}]`;
         }
         const items = [];
         if (updated.method === 'check') {
             await syncInvoiceAllocations(newTx);
     return newTx; // Check accounting is fully handled by syncCheckAccountingDocument
         } else {
             if (updated.type === 'receive') {
                items.push({
                   description: `دریافت وجه به مبلغ ${formattedAmount} واریز به ${resourceName} بابت رسید دریافت شماره ${updated.receiptNumber || updated.id}`,
                   debit: Number(updated.amount),
                   credit: 0,
                   ledgerAccountId: resourceLedgerId});
                items.push({
                   description: `طرف حساب ${personName} به مبلغ ${formattedAmount} بابت رسید دریافت شماره ${updated.receiptNumber || updated.id}`,
                   debit: 0,
                   credit: Number(updated.amount),
                   ledgerAccountId: personLedgerId,
                   detailedAccountId: updated.personId});
             } else if (updated.type === 'salary') {
                const expenseAcc = ledgerAccounts.find((a: any) => a.code === '52') || ledgerAccounts.find((a: any) => a.code === '5') || { id: defaultLedger };
                items.push({
                   description: `هزینه حقوق و دستمزد کارمند ${personName} بابت فیش حقوقی شماره ${updated.receiptNumber || updated.id}`,
                   debit: Number(updated.amount),
                   credit: 0,
                   ledgerAccountId: expenseAcc.id});
                items.push({
                   description: `طرف حساب ${personName} بابت حقوق و دستمزد شماره فیش ${updated.receiptNumber || updated.id}`,
                   debit: 0,
                   credit: Number(updated.amount),
                   ledgerAccountId: personLedgerId,
                   detailedAccountId: updated.personId});
             } else {
                items.push({
                   description: `طرف حساب ${personName} به مبلغ ${formattedAmount} بابت رسید پرداخت شماره ${updated.receiptNumber || updated.id}`,
                   debit: Number(updated.amount),
                   credit: 0,
                   ledgerAccountId: personLedgerId,
                   detailedAccountId: updated.personId});
                items.push({
                   description: `پرداخت وجه به مبلغ ${formattedAmount} از ${resourceName} بابت رسید شماره ${updated.receiptNumber || updated.id}`,
                   debit: 0,
                   credit: Number(updated.amount),
                   ledgerAccountId: resourceLedgerId});
             }
         }
         await updateAccountingDocument(existingDoc.id, {
            ...existingDoc,
            date: updated.date || existingDoc.date,
            description: docDescription,
            items});
       }
     } catch (e) {
       console.error("Failed to update auto accounting doc for transaction:", e);
     }

     await syncInvoiceAllocations(newTx);
     return newTx;
  } catch (e) {
     throw new Error('Transaction not found');
  }
};

export const deleteTransaction = async (id: string) => {
  const transactions = await getTransactions();
  const t = transactions.find(tx => String(tx.id) === String(id));
  if (t) {
    const operations: any[] = [];
    const amount = Number(t.amount) || 0;
    if (t.resourceType === 'bank') {
      const accounts = await getLocalData<any[]>('accounts', []);
      const index = accounts.findIndex(a => a.id === t.resourceId);
      if (index !== -1) {
        let newBalance = accounts[index].balance;
        if (t.type === 'receive') {
          newBalance -= amount;
        } else {
          newBalance += amount;
        }
        operations.push({ type: 'update', key: 'accounts', id: accounts[index].id, data: { balance: newBalance } });
      }
    } else if (t.resourceType === 'cashbox') {
      const cashboxes = await getLocalData<any[]>('cashboxes', []);
      const index = cashboxes.findIndex(c => c.id === t.resourceId);
      if (index !== -1) {
        let newBalance = cashboxes[index].balance;
        if (t.type === 'receive') {
          newBalance -= amount;
        } else {
          newBalance += amount;
        }
        operations.push({ type: 'update', key: 'cashboxes', id: cashboxes[index].id, data: { balance: newBalance } });
      }
    }
    const table = mapTransactionTypeToTable(t.type);
    operations.push({ type: 'delete', key: table, id: id });
    if (t.type === 'salary') {
        const allPayslips = await getLocalData<any[]>('payslips', []);
        const toDelete = allPayslips.find(p => String(p.transactionId) === String(id));
        if (toDelete) {
            operations.push({ type: 'delete', key: 'payslips', id: toDelete.id });
        }
    }
    if (operations.length > 0) {
      await batchLocalData(operations);
    }
    
    // Clear allocations
    await syncInvoiceAllocations({ id, linkedInvoices: {} });

    // Delete corresponding accounting document
    try {
      const accDocs = await getLocalData<any[]>('accounting_documents', []);
      const docOperations: any[] = [];
      accDocs.forEach(d => {
         if (String(d.sourceId) === String(id) && (d.sourceType === 'receipt' || d.sourceType === 'payment')) {
            docOperations.push({ type: 'delete', key: 'accounting_documents', id: d.id });
         }
      });
      if (docOperations.length > 0) {
         await batchLocalData(docOperations);
      }
    } catch(e) {}
  }
};

// Invoices

const mapInvoiceTypeToTable = (type: string) => {
  switch (type) {
    case 'sale': return 'sales_invoices';
    case 'purchase': return 'purchase_invoices';
    case 'warehouse_receipt': return 'warehouse_receipts';
    case 'warehouse_remittance': return 'warehouse_remittances';
    case 'proforma': return 'proforma_invoices';
    case 'sale_return': return 'sale_returns';
    case 'purchase_return': return 'purchase_returns';
    case 'waste': return 'wastes';
    default: return 'invoices';
  }
};

export const getInvoices = async () => {
  const tables = ['invoices', 'sales_invoices', 'purchase_invoices', 'warehouse_receipts', 'warehouse_remittances', 'proforma_invoices', 'sale_returns', 'purchase_returns', 'wastes'];
  let allInvoices: any[] = [];
  for (const t of tables) {
     const data = await getLocalData<any[]>(t, [], { limit: 500 });
     if (data) allInvoices = allInvoices.concat(data);
  }
  const invoices = allInvoices;
  return (invoices || []).filter(inv => !inv.isDeleted).sort((a, b) => b.createdAt - a.createdAt);
};

export const addInvoice = async (invoice: any, skipRecalc: boolean = false) => {
  let activeYear = null;
  if (invoice.date) activeYear = await checkFinancialYear(invoice.date);
  const now = Date.now();
  
  // Apply auto-generated invoice number if missing
  let finalInvoiceObj = { ...invoice };
  if (!finalInvoiceObj.invoiceNumber || finalInvoiceObj.invoiceNumber.trim() === '') {
     finalInvoiceObj.invoiceNumber = await generateDocNumber(finalInvoiceObj.type);
  }

  const newInvoice = { ...finalInvoiceObj, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  await appendLocalData(mapInvoiceTypeToTable(newInvoice.type), newInvoice);
  
  if (newInvoice.invoiceNumber) {
     await updateDocCounter(newInvoice.type, newInvoice.invoiceNumber);
  }
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'Invoice'.toUpperCase(), 'ثبت رکورد جدید در invoices', 'Invoice', newInvoice.id);
  }

  // Generate price history for invoice items
  if (newInvoice.type === 'purchase' || newInvoice.type === 'sale') {
     if (newInvoice.items && Array.isArray(newInvoice.items)) {
         for (const item of newInvoice.items) {
             if (item.productId && Number(item.unitPrice) > 0) {
                 await appendLocalData('product_price_history', {
                     id: generateId(),
                     productId: item.productId,
                     date: newInvoice.date || new Date().toISOString().split('T')[0],
                     type: newInvoice.type,
                     price: Number(item.unitPrice),
                     invoiceId: newInvoice.id,
                     quantity: Number(item.quantity) || 0,
                     invoiceItemId: item.id || generateId()
                 });
             }
         }
     }
  }

  // Recalculate warehouse stocks automatically
  if (!skipRecalc) {
    await recalculateAllWarehouseStocks();
  }

  if (newInvoice.isDraft || newInvoice.status === 'draft') {
    return newInvoice;
  }

  try {
     const docType = newInvoice.type;
     let title = 'فاکتور';
     if (docType === 'sale') title = 'فاکتور فروش';
     if (docType === 'purchase') title = 'فاکتور خرید';
     if (docType === 'sale_return') title = 'برگشت از فروش';
     if (docType === 'purchase_return') title = 'برگشت از خرید';
     
     const items = [];
     const ledgerAccounts = await getLedgerAccounts();
     const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';
     const total = Number(newInvoice.totalAmount) || 0;

     // Find Customer/Supplier/Person Ledger Account
     let personLedgerId = defaultLedger;
     if (newInvoice.customerId) {
        const persons = await getLocalData<any[]>('persons', []);
        const person = persons.find(p => String(p.id) === String(newInvoice.customerId));
        if (person && person.accountingCode) {
           const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
           if (acc) personLedgerId = acc.id;
        }
     }

     // Find Sales Revenue ('41') Ledger Account
     let salesLedgerId = defaultLedger;
     const salesAcc = ledgerAccounts.find(a => a.code === '41');
     if (salesAcc) salesLedgerId = salesAcc.id;

     // Find Inventory ('13') Ledger Account
     let inventoryLedgerId = defaultLedger;
     const inventoryAcc = ledgerAccounts.find(a => a.code === '13');
     if (inventoryAcc) inventoryLedgerId = inventoryAcc.id;
     
     if (docType === 'sale' || docType === 'purchase_return') {
        items.push({ description: 'شخص', debit: total, credit: 0, ledgerAccountId: personLedgerId, detailedAccountId: newInvoice.customerId});
        items.push({ description: 'درآمد/فروش', debit: 0, credit: total, ledgerAccountId: salesLedgerId});
     } else if (docType === 'purchase' || docType === 'sale_return') {
        items.push({ description: 'موجودی کالا', debit: total, credit: 0, ledgerAccountId: inventoryLedgerId});
        items.push({ description: 'شخص', debit: 0, credit: total, ledgerAccountId: personLedgerId, detailedAccountId: newInvoice.customerId});
     }
     
     if (items.length > 0) {
       await addAccountingDocument({
          date: newInvoice.date || new Date().toISOString().split('T')[0],
          description: `${title} شماره ${newInvoice.invoiceNumber || newInvoice.id}`,
          status: 'approved',
          sourceType: docType === 'sale' ? 'invoice_sale' : docType === 'purchase' ? 'invoice_purchase' : docType === 'sale_return' ? 'invoice_sale_return' : 'invoice_purchase_return',
          sourceId: newInvoice.id,
          items});
     }
  } catch(e) {}

  return newInvoice;
};

export const updateInvoice = async (id: string | number, updated: any, skipRecalc: boolean = false) => {
  let activeYear = null;
  if (updated.date) activeYear = await checkFinancialYear(updated.date);
  
  const updatedData = { ...updated, updatedAt: Date.now() };
  if (activeYear) updatedData.fiscalYearId = activeYear.id;
  const table = updatedData.type ? mapInvoiceTypeToTable(updatedData.type) : 'invoices';
  const newInvoice = await updateLocalData(table, id, updatedData);
  
  if (newInvoice && newInvoice.invoiceNumber) {
      await updateDocCounter(newInvoice.type, newInvoice.invoiceNumber);
  }
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('UPDATE_' + 'Invoice'.toUpperCase(), 'ویرایش رکورد در invoices', 'Invoice', newInvoice.id);
  }

  // Generate/Update price history for invoice items
  if (newInvoice.type === 'purchase' || newInvoice.type === 'sale') {
      try {
          const oldHistories = await getLocalData<any[]>('product_price_history', []);
          const filteredHistories = oldHistories.filter(h => h.invoiceId?.toString() !== newInvoice.id?.toString());
          
          if (newInvoice.items && Array.isArray(newInvoice.items)) {
              for (const item of newInvoice.items) {
                  if (item.productId && Number(item.unitPrice) > 0) {
                      filteredHistories.push({
                          id: generateId(),
                          productId: item.productId,
                          date: newInvoice.date || new Date().toISOString().split('T')[0],
                          type: newInvoice.type,
                          price: Number(item.unitPrice),
                          invoiceId: newInvoice.id,
                          quantity: Number(item.quantity) || 0,
                          invoiceItemId: item.id || generateId()
                      });
                  }
              }
          }
          await saveLocalData('product_price_history', filteredHistories);
      } catch (e) {
          console.error(e);
      }
  }

  // Auto-update corresponding accounting document
  try {
     const docType = newInvoice.type;
     const title = docType === 'sale' ? 'فاکتور فروش' : docType === 'purchase' ? 'فاکتور خرید' : docType === 'sale_return' ? 'برگشت از فروش' : docType === 'purchase_return' ? 'برگشت از خرید' : 'فاکتور';
     
     const accountingDocs = await getAccountingDocuments();
     const existingDoc = accountingDocs.find((d: any) => 
       (d.sourceType === 'invoice_sale' || d.sourceType === 'invoice_purchase' || d.sourceType === 'invoice_sale_return' || d.sourceType === 'invoice_purchase_return') && String(d.sourceId) === String(id)
     );
     
     if (existingDoc) {
       const ledgerAccounts = await getLedgerAccounts();
       const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';
       const total = Number(newInvoice.totalAmount) || 0;

       // Find Customer/Supplier/Person Ledger Account
       let personLedgerId = defaultLedger;
       if (newInvoice.customerId) {
          const persons = await getLocalData<any[]>('persons', []);
          const person = persons.find(p => String(p.id) === String(newInvoice.customerId));
          if (person && person.accountingCode) {
             const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
             if (acc) personLedgerId = acc.id;
          }
       }

       // Find Sales Revenue ('41') Ledger Account
       let salesLedgerId = defaultLedger;
       const salesAcc = ledgerAccounts.find(a => a.code === '41');
       if (salesAcc) salesLedgerId = salesAcc.id;

       // Find Inventory ('13') Ledger Account
       let inventoryLedgerId = defaultLedger;
       const inventoryAcc = ledgerAccounts.find(a => a.code === '13');
       if (inventoryAcc) inventoryLedgerId = inventoryAcc.id;

       const items = [];
       if (docType === 'sale' || docType === 'purchase_return') {
          items.push({ description: 'شخص', debit: total, credit: 0, ledgerAccountId: personLedgerId, detailedAccountId: newInvoice.customerId});
          items.push({ description: 'درآمد/فروش', debit: 0, credit: total, ledgerAccountId: salesLedgerId});
       } else if (docType === 'purchase' || docType === 'sale_return') {
          items.push({ description: 'موجودی کالا', debit: total, credit: 0, ledgerAccountId: inventoryLedgerId});
          items.push({ description: 'شخص', debit: 0, credit: total, ledgerAccountId: personLedgerId, detailedAccountId: newInvoice.customerId});
       }

       await updateAccountingDocument(existingDoc.id, {
          ...existingDoc,
          date: newInvoice.date || existingDoc.date || new Date().toISOString().split('T')[0],
          description: `${title} شماره ${newInvoice.invoiceNumber || newInvoice.id}`,
          items
       });
     }
  } catch (e) {
     console.error("Failed to update auto accounting doc for invoice:", e);
  }

  // Update auto-generated warehouse documents
  try {
     const invoices = await getInvoices();
     const relatedWarehouseDocs = invoices.filter((inv: any) => 
        inv.isAutoGenerated && 
        inv.sourceInvoiceId && 
        (String(inv.sourceInvoiceId) === String(id) || String(inv.sourceInvoiceId) === String(newInvoice.invoiceNumber))
     );
     
     for (const wDoc of relatedWarehouseDocs) {
         await updateLocalData(mapInvoiceTypeToTable(wDoc.type), wDoc.id, {
             ...wDoc,
             items: newInvoice.items.map((item: any) => ({
                 ...item,
                 warehouseId: item.warehouseId || newInvoice.warehouseId || wDoc.warehouseId,
             })),
             updatedAt: Date.now()
         });
     }
  } catch(e) {
      console.error("Failed to update auto warehouse docs:", e);
  }

  if (!skipRecalc) {
    await recalculateAllWarehouseStocks();
  }
  return newInvoice;
};

export const voidInvoice = async (id: string | number) => {
  const invoices = await getInvoices();
  const invoiceToVoid = invoices.find((p: any) => String(p.id) === String(id) || p.id === Number(id));
  
  if (invoiceToVoid) {
    const toVoidIds = new Set([id, Number(id), String(id)]);
    
    invoices.forEach(inv => {
       if (inv.isAutoGenerated && inv.sourceInvoiceId && (inv.sourceInvoiceId === invoiceToVoid.id || inv.sourceInvoiceId === invoiceToVoid.invoiceNumber)) {
          toVoidIds.add(inv.id);
          toVoidIds.add(String(inv.id));
       }
    });

    invoices.forEach(inv => {
      if (toVoidIds.has(inv.id) || toVoidIds.has(String(inv.id))) {
        inv.status = 'voided';
      }
    });
    
    for (const inv of invoices) {
       if (inv.status === 'voided') {
          await updateLocalData(mapInvoiceTypeToTable(inv.type), inv.id, inv);
       }
    }
  

    // void related accounting docs
    const accDocs = await getLocalData<any[]>('accounting_documents', []);
    let accDocsChanged = false;
    accDocs.forEach(d => {
       if (toVoidIds.has(d.sourceId) || toVoidIds.has(String(d.sourceId))) {
          d.status = 'voided';
          d.isDeleted = true; // also delete so it doesn't affect ledger
          accDocsChanged = true;
       }
    });
    if (accDocsChanged) await saveLocalData('accounting_documents', accDocs);

    await recalculateAllWarehouseStocks();
  }
};

export const deleteInvoice = async (id: string, forceDelete: boolean = false, skipRecalc: boolean = false) => {
  const invoices = await getInvoices();
  const invoiceToDelete = invoices.find((p: any) => String(p.id) === String(id) || p.id === Number(id) || p.id === String(id));
  
  if (invoiceToDelete) {
    if (invoiceToDelete.status !== 'draft' && !invoiceToDelete.isDraft && !forceDelete) {
      throw new Error('این فاکتور تایید شده است و قابلیت حذف ندارد. می‌توانید آن را ابطال یا مرجوع کنید.');
    }
    const toDeleteIds = new Set([id, Number(id), String(id)]);
    
    invoices.forEach(inv => {
       if (inv.isAutoGenerated && inv.sourceInvoiceId && (inv.sourceInvoiceId === invoiceToDelete.id || inv.sourceInvoiceId === invoiceToDelete.invoiceNumber)) {
          toDeleteIds.add(inv.id);
          toDeleteIds.add(String(inv.id));
       }
    });

    const operations: any[] = [];
    
    // Soft delete
    invoices.forEach(inv => {
      if (toDeleteIds.has(inv.id) || toDeleteIds.has(String(inv.id))) {
        operations.push({ type: 'delete', key: mapInvoiceTypeToTable(inv.type), id: inv.id });
      }
    });
    
    // delete related accounting docs
    const accDocs = await getLocalData<any[]>('accounting_documents', []);
    accDocs.forEach(d => {
       if (toDeleteIds.has(d.sourceId) || toDeleteIds.has(String(d.sourceId))) {
          operations.push({ type: 'delete', key: 'accounting_documents', id: d.id });
       }
    });

    if (operations.length > 0) {
      await batchLocalData(operations);
    }
    
    // Clear allocations for the deleted invoice(s)
    try {
        const sales = await getLocalData<any[]>('sales_invoice_payments', []);
        const newSales = sales.filter(h => !toDeleteIds.has(h.invoiceId) && !toDeleteIds.has(String(h.invoiceId)) && !toDeleteIds.has(Number(h.invoiceId)));
        await saveLocalData('sales_invoice_payments', newSales);

        const purchases = await getLocalData<any[]>('purchase_invoice_payments', []);
        const newPurchases = purchases.filter(h => !toDeleteIds.has(h.invoiceId) && !toDeleteIds.has(String(h.invoiceId)) && !toDeleteIds.has(Number(h.invoiceId)));
        await saveLocalData('purchase_invoice_payments', newPurchases);
        
        // Also remove linkedInvoices from transactions
        const transactions = await getTransactions();
        let txChanged = false;
        for (const tx of transactions) {
             if (tx.linkedInvoices) {
                  let hasDel = false;
                  for (const invId of Object.keys(tx.linkedInvoices)) {
                       if (toDeleteIds.has(invId) || toDeleteIds.has(String(invId)) || toDeleteIds.has(Number(invId))) {
                            delete tx.linkedInvoices[invId];
                            hasDel = true;
                       }
                  }
                  if (hasDel) {
                       await updateLocalData(mapTransactionTypeToTable(tx.type), tx.id, tx);
                  }
             }
        }
    } catch(e) {}

    if (typeof addSystemLog !== 'undefined') {
       // addSystemLog is no-op, backend handles log for batch
    }

    // Recalculate warehouse stocks automatically
    if (!skipRecalc) {
      await recalculateAllWarehouseStocks();
    }
  }
};

// Checkbooks
export const getCheckbooks = async () => {
  const data = await getLocalData<any[]>('checkbooks', []);
  return data.sort((a, b) => b.createdAt - a.createdAt);
};

export const addCheckbook = async (record: any) => {
  const data = await getLocalData<any[]>('checkbooks', []);
  const now = Date.now();
  const activeYear = await getActiveFinancialYear();
  const newItem = { ...record, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  data.push(newItem);
  await saveLocalData('checkbooks', data);
  
  if (newItem.startNumber && newItem.endNumber) {
     const start = parseInt(newItem.startNumber);
     const end = parseInt(newItem.endNumber);
     if (!isNaN(start) && !isNaN(end) && end >= start) {
         const padding = newItem.startNumber.length;
         const issuedChecks = await getLocalData<any[]>('issued_checks', []);
         for (let i = start; i <= end; i++) {
             issuedChecks.push({
                 id: generateId(),
                 checkbookId: newItem.id,
                 checkNumber: String(i).padStart(padding, '0'),
                 amount: 0,
                 issueDate: "",
                 dueDate: "",
                 payeeId: "",
                 status: 'blank',
                 createdAt: now,
                 updatedAt: now,
                 fiscalYearId: activeYear ? activeYear.id : undefined
             });
         }
         await saveLocalData('issued_checks', issuedChecks);
     }
  }

  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'Checkbook'.toUpperCase(), 'ثبت رکورد جدید در checkbooks', 'Checkbook', newItem.id);
  }
  return newItem;
};

export const updateCheckbook = async (id: string, record: any) => {
  const data = await getLocalData<any[]>('checkbooks', []);
  const index = data.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    const activeYear = await getActiveFinancialYear();
    data[index] = { ...data[index], ...record, updatedAt: Date.now() };
    if (activeYear) {
      data[index].fiscalYearId = activeYear.id;
    }
    await saveLocalData('checkbooks', data);
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('UPDATE_' + 'Checkbook'.toUpperCase(), 'ویرایش رکورد در checkbooks', 'Checkbook', data[index].id);
  }

    return data[index];
  }
  return null;
};

export const deleteCheckbook = async (id: string) => {
  const data = await getLocalData<any[]>('checkbooks', []);
  await saveLocalData('checkbooks', data.filter((p: any) => String(p.id) !== String(id)));
};

// Issued Checks
export const getIssuedChecks = async () => {
  const data = await getLocalData<any[]>('issued_checks', []);
  return data.sort((a, b) => b.createdAt - a.createdAt);
};


export const getCheckHistory = async (checkId?: string | number, checkType?: 'issued' | 'received') => {
  const data = await getLocalData<any[]>('check_history', []);
  let filtered = data;
  if (checkId) filtered = filtered.filter(h => String(h.checkId) === String(checkId));
  if (checkType) filtered = filtered.filter(h => h.checkType === checkType);
  return filtered.sort((a, b) => b.createdAt - a.createdAt);
};

export const addCheckHistory = async (record: { checkId: string | number, checkType: 'issued' | 'received', status: string, date: string, desc?: string, user?: string }) => {
  const now = Date.now();
  const newItem = { ...record, id: generateId(), createdAt: now };
  await appendLocalData('check_history', newItem);
  return newItem;
};

export const addIssuedCheck = async (record: any) => {
  let activeYear = null;
  if (record.issueDate) activeYear = await checkFinancialYear(record.issueDate);
  const now = Date.now();
  const newItem = { ...record, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  await appendLocalData('issued_checks', newItem);
  await addCheckHistory({ checkId: newItem.id, checkType: 'issued', status: newItem.status || 'issued', date: new Date().toISOString(), desc: 'ثبت اولیه چک صادره' });
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'IssuedCheck'.toUpperCase(), 'ثبت رکورد جدید در issued_checks', 'IssuedCheck', newItem.id);
  }

  try {
    await syncCheckAccountingDocument('issued', newItem);
  } catch (e) {}

  return newItem;
};

export const updateIssuedCheck = async (id: string, record: any) => {
  let activeYear = null;
  if (record.issueDate) activeYear = await checkFinancialYear(record.issueDate);
  const updatedData = { ...record, updatedAt: Date.now() };
  try {
     const oldChecks = await getIssuedChecks();
     const previous = oldChecks.find((c: any) => String(c.id) === String(id));
     const saved = await updateLocalData('issued_checks', id, updatedData);
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'IssuedCheck'.toUpperCase(), 'ویرایش رکورد در issued_checks', 'IssuedCheck', saved.id);
     }
     if (saved) {
       await syncCheckAccountingDocument('issued', saved, previous);
     }
     return saved;
  } catch (e) {
     return null;
  }
};

export const deleteIssuedCheck = async (id: string) => {
  const data = await getLocalData<any[]>('issued_checks', []);
  const index = data.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    const deletedCheck = { ...data[index], isDeleted: true };
    await updateLocalData('issued_checks', id, deletedCheck);
    try {
      const existingDocs = await getAccountingDocuments();
      for (const d of existingDocs) {
        if ((d.sourceType === 'check_issued_init' && String(d.sourceId) === String(id)) ||
            (d.sourceType === 'check_issued_status' && String(d.sourceId).startsWith(String(id)))) {
          await updateLocalData('accounting_documents', d.id, { ...d, isDeleted: true });
        }
      }
    } catch (e) {}
  }
};

// Received Checks
export const getReceivedChecks = async () => {
  const data = await getLocalData<any[]>('received_checks', []);
  return data.sort((a, b) => b.createdAt - a.createdAt);
};

export const addReceivedCheck = async (record: any) => {
  const checkDate = record.receiveDate || record.issueDate;
  let activeYear = null;
  if (checkDate) activeYear = await checkFinancialYear(checkDate);
  const now = Date.now();
  const newItem = { ...record, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  await appendLocalData('received_checks', newItem);
  await addCheckHistory({ checkId: newItem.id, checkType: 'received', status: newItem.status || 'received', date: new Date().toISOString(), desc: 'ثبت اولیه چک دریافتی' });
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'ReceivedCheck'.toUpperCase(), 'ثبت رکورد جدید در received_checks', 'ReceivedCheck', newItem.id);
  }

  try {
    await syncCheckAccountingDocument('received', newItem);
  } catch (e) {}

  return newItem;
};

export const updateReceivedCheck = async (id: string, record: any) => {
  const checkDate = record.receiveDate || record.issueDate;
  let activeYear = null;
  if (checkDate) activeYear = await checkFinancialYear(checkDate);
  const updatedData = { ...record, updatedAt: Date.now() };
  try {
     const oldChecks = await getReceivedChecks();
     const previous = oldChecks.find((c: any) => String(c.id) === String(id));
     const saved = await updateLocalData('received_checks', id, updatedData);
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'ReceivedCheck'.toUpperCase(), 'ویرایش رکورد در received_checks', 'ReceivedCheck', saved.id);
     }
     if (saved) {
       await syncCheckAccountingDocument('received', saved, previous);
     }
     return saved;
  } catch (e) {
     return null;
  }
};

export const deleteReceivedCheck = async (id: string) => {
  const data = await getLocalData<any[]>('received_checks', []);
  const index = data.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    const deletedCheck = { ...data[index], isDeleted: true };
    await updateLocalData('received_checks', id, deletedCheck);
    try {
      const existingDocs = await getAccountingDocuments();
      for (const d of existingDocs) {
        if ((d.sourceType === 'check_received_init' && String(d.sourceId) === String(id)) ||
            (d.sourceType === 'check_received_status' && String(d.sourceId).startsWith(String(id)))) {
          await updateLocalData('accounting_documents', d.id, { ...d, isDeleted: true });
        }
      }
    } catch (e) {}
  }
};

// Warehouse Stocks Persistence & Recalculation
export const getRefundRequests = async () => {
  return await getLocalData<any[]>('refundRequests', []);
};

export const addRefundRequest = async (request: any) => {
  const now = Date.now();
  let activeYear = null;
  if (request.date) {
    activeYear = await checkFinancialYear(request.date);
  } else {
    activeYear = await getActiveFinancialYear();
  }
  const newRequest = { ...request, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  await appendLocalData('refundRequests', newRequest);
  
  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_' + 'RefundRequest'.toUpperCase(), 'ثبت رکورد جدید در refundRequests', 'RefundRequest', newRequest.id);
  }

  return newRequest;
};

export const updateRefundRequest = async (id: string, updated: any) => {
  let activeYear = null;
  if (updated.date) {
    activeYear = await checkFinancialYear(updated.date);
  } else {
    activeYear = await getActiveFinancialYear();
  }
  const updatedData = { ...updated, updatedAt: Date.now() };
  if (activeYear) updatedData.fiscalYearId = activeYear.id;
  try {
     const saved = await updateLocalData('refundRequests', id, updatedData);
     if (typeof addSystemLog !== 'undefined') {
       await addSystemLog('UPDATE_' + 'RefundRequest'.toUpperCase(), 'ویرایش رکورد در refundRequests', 'RefundRequest', saved.id);
     }
     return saved;
  } catch(e) {
     return null;
  }
};

export const deleteRefundRequest = async (id: string) => {
  const requests = await getLocalData<any[]>('refundRequests', []);
  const index = requests.findIndex(r => String(r.id) === String(id));
  if (index !== -1) {
    await updateLocalData('refundRequests', id, { ...requests[index], isDeleted: true });
  }
};

export const getWarehouseStocks = async () => {
  const data = await getLocalData<any[]>('warehouse_stocks', []);
  if (!data || data.length === 0) {
    // Perform initial recalculation if empty
    return await recalculateAllWarehouseStocks();
  }
  return data;
};

export const saveWarehouseStocks = async (stocks: any[]) => {
  await saveLocalData('warehouse_stocks', stocks);
};

export const recalculateAllWarehouseStocks = async () => {
  try {
    const res = await fetch('/api/db/recalculate-stocks', { method: 'POST' });
    if (res.ok) {
      const result = await res.json();
      return result.data;
    }
  } catch(e) {
    console.error('Error recalculating stocks', e);
  }
  return [];
};


export const getStocktakings = async () => getLocalData<any[]>('stocktakings', []);
export const saveStocktakings = async (data: any[]) => saveLocalData('stocktakings', data);
export const addStocktaking = async (st: any) => {
  let activeYear = null;
  if (st.date) activeYear = await checkFinancialYear(st.date);
  const stocktakings = await getStocktakings();
  const added = { ...st, id: generateId(), fiscalYearId: activeYear ? activeYear.id : undefined };
  stocktakings.push(added);
  await saveStocktakings(stocktakings);
  return added;
};
export const updateStocktaking = async (id: string | number, updatedSt: any) => {
  let activeYear = null;
  if (updatedSt.date) activeYear = await checkFinancialYear(updatedSt.date);
  const stocktakings = await getStocktakings();
  const idx = stocktakings.findIndex(s => s.id?.toString() === id?.toString());
  if (idx > -1) {
    if (activeYear) updatedSt.fiscalYearId = activeYear.id;
    stocktakings[idx] = updatedSt;
    await saveStocktakings(stocktakings);
    return updatedSt;
  }
  return null;
};
export const deleteStocktaking = async (id: string | number) => {
  const stocktakings = await getStocktakings();
  const newSts = stocktakings.filter(s => s.id?.toString() !== id?.toString());
  await saveStocktakings(newSts);
};

// --- Follow Ups (CRM) ---
export const getPersonFollowUps = async () => {
  const followUps = await getLocalData<any[]>('person_follow_ups', []);
  return followUps.sort((a, b) => b.createdAt - a.createdAt);
};

export const addPersonFollowUp = async (followUp: any) => {
  const followUps = await getPersonFollowUps();
  const newFollowUp = { ...followUp, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() };
  followUps.push(newFollowUp);
  await saveLocalData('person_follow_ups', followUps);
  return newFollowUp;
};

export const updatePersonFollowUp = async (id: string | number, followUp: any) => {
  const followUps = await getPersonFollowUps();
  const index = followUps.findIndex((p: any) => String(p.id) === String(id));
  if (index !== -1) {
    followUps[index] = { ...followUps[index], ...followUp, updatedAt: Date.now() };
    await saveLocalData('person_follow_ups', followUps);
  }
};

export const deletePersonFollowUp = async (id: string | number) => {
  const followUps = await getPersonFollowUps();
  await saveLocalData('person_follow_ups', followUps.filter((p: any) => String(p.id) !== String(id)));
};

export const getLoans = async () => getLocalData<any[]>('loans', []);
export const saveLoans = async (loans: any[]) => {
  const activeYear = await getActiveFinancialYear();
  const processedLoans = [];
  for (const loan of loans) {
    let fiscalYearId = loan.fiscalYearId;
    if (!fiscalYearId) {
      if (loan.startDate) {
        try {
          const yr = await checkFinancialYear(loan.startDate);
          if (yr) fiscalYearId = yr.id;
        } catch (e) {
          if (activeYear) fiscalYearId = activeYear.id;
        }
      } else if (activeYear) {
        fiscalYearId = activeYear.id;
      }
    }
    processedLoans.push({ ...loan, fiscalYearId });
  }
  await saveLocalData('loans', processedLoans);
};

export const getLedgerAccounts = async () => {
  let accs = await getLocalData<any[]>('ledger_accounts', []);
  if (accs.length === 0) {
    const assetsId = generateId();
    const liabilitiesId = generateId();
    const equityId = generateId();
    const incomeId = generateId();
    const expensesId = generateId();
    
    accs = [
      { id: assetsId, code: '1', title: 'دارایی‌ها', type: 'group', nature: 'debit', parentId: null },
      { id: liabilitiesId, code: '2', title: 'بدهی‌ها', type: 'group', nature: 'credit', parentId: null },
      { id: equityId, code: '3', title: 'حقوق صاحبان سهام', type: 'group', nature: 'credit', parentId: null },
      { id: incomeId, code: '4', title: 'درآمدها', type: 'group', nature: 'credit', parentId: null },
      { id: expensesId, code: '5', title: 'هزینه‌ها', type: 'group', nature: 'debit', parentId: null },
      
      { id: generateId(), code: '11', title: 'موجودی نقد و بانک', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '12', title: 'حساب‌ها و اسناد دریافتنی تجاری', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '13', title: 'موجودی مواد و کالا', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '14', title: 'پیش پرداخت‌ها', type: 'general', nature: 'debit', parentId: assetsId },
      { id: generateId(), code: '15', title: 'دارایی‌های ثابت', type: 'general', nature: 'debit', parentId: assetsId },
      
      { id: generateId(), code: '21', title: 'حساب‌ها و اسناد پرداختنی تجاری', type: 'general', nature: 'credit', parentId: liabilitiesId },
      { id: generateId(), code: '22', title: 'پیش دریافت‌ها', type: 'general', nature: 'credit', parentId: liabilitiesId },
      
      { id: generateId(), code: '31', title: 'سرمایه', type: 'general', nature: 'credit', parentId: equityId },
      
      { id: generateId(), code: '41', title: 'فروش کالا و خدمات', type: 'general', nature: 'credit', parentId: incomeId },
      
      { id: generateId(), code: '51', title: 'بهای تمام شده کالای فروش رفته', type: 'general', nature: 'debit', parentId: expensesId },
      { id: generateId(), code: '52', title: 'هزینه‌های حقوق و دستمزد', type: 'general', nature: 'debit', parentId: expensesId },
      { id: generateId(), code: '53', title: 'هزینه‌های اداری و تشکیلاتی', type: 'general', nature: 'debit', parentId: expensesId }
    ];
    await saveLocalData('ledger_accounts', accs);
  }
  return accs;
};
export const saveLedgerAccounts = async (data: any[]) => saveLocalData('ledger_accounts', data);
export const addLedgerAccount = async (la: any) => {
  const accs = await getLedgerAccounts();
  const added = { ...la, id: la.id || generateId() };
  accs.push(added);
  await saveLedgerAccounts(accs);
  return added;
};
export const updateLedgerAccount = async (id: string | number, updated: any) => {
  const accs = await getLedgerAccounts();
  const idx = accs.findIndex((x: any) => x.id?.toString() === id?.toString());
  if (idx > -1) {
    accs[idx] = updated;
    await saveLedgerAccounts(accs);
    return updated;
  }
  return null;
};
export const deleteLedgerAccount = async (id: string | number) => {
  const accs = await getLedgerAccounts();
  const newAccs = accs.filter((x: any) => x.id?.toString() !== id?.toString());
  await saveLedgerAccounts(newAccs);
};

export const getAccountingDocuments = async () => {
  const docs = await getLocalData<any[]>('accounting_documents', []);
  return (docs || [])
    .filter(d => !d.isDeleted)
    .sort((a, b) => {
       // Sort by documentNumber descending as primary, then createdAt
       const numB = Number(b.documentNumber || 0);
       const numA = Number(a.documentNumber || 0);
       if (numB !== numA) return numB - numA;
       
       const timeB = b.createdAt || new Date(b.date || 0).getTime() || 0;
       const timeA = a.createdAt || new Date(a.date || 0).getTime() || 0;
       return timeB - timeA;
    });
};
export const saveAccountingDocuments = async (data: any[]) => saveLocalData('accounting_documents', data);
export const addAccountingDocument = async (doc: any) => {
  if (doc.date) {
    doc.date = convertToGregorian(doc.date);
  }
  let activeYear = null;
  if (doc.date) activeYear = await checkFinancialYear(doc.date);
  
  // Generate a document number if not provided
  let docNum = doc.documentNumber;
  if (!docNum || String(docNum).trim() === '') {
     const settings = await getStoreSettings();
     if (settings && (settings as any).prefix_accounting_document !== undefined) {
         docNum = await generateDocNumber('accounting_document');
     } else {
         const docs = await getAccountingDocuments();
         let maxDocNum = 0;
         docs.forEach((d: any) => { if (Number(d.documentNumber) > maxDocNum) maxDocNum = Number(d.documentNumber); });
         docNum = String(maxDocNum + 1).padStart(4, '0');
     }
  }
  const sysSettings2 = await getStoreSettings();
  const sysCurrency2 = sysSettings2?.currency || 'تومان';
  doc.currency = doc.currency || sysCurrency2;
  if (doc.items && Array.isArray(doc.items)) {
     doc.items = doc.items.map((i) => ({ ...i, currency: i.currency || sysCurrency2 }));
  }
  const added = { ...doc, id: generateId(), documentNumber: docNum, createdAt: Date.now(), fiscalYearId: activeYear ? activeYear.id : undefined };
  await appendLocalData('accounting_documents', added);
  if (added.documentNumber) {
      await updateDocCounter('accounting_document', added.documentNumber);
  }
  return added;
};
export const updateAccountingDocument = async (id: string | number, updated: any) => {
  let activeYear = null;
  if (updated.date) activeYear = await checkFinancialYear(updated.date);
  if (updated.documentNumber) {
      await updateDocCounter('accounting_document', updated.documentNumber);
  }
  const sysSettings3 = await getStoreSettings();
  const sysCurrency3 = sysSettings3?.currency || 'تومان';
  updated.currency = updated.currency || sysCurrency3;
  if (updated.items && Array.isArray(updated.items)) {
     updated.items = updated.items.map((i) => ({ ...i, currency: i.currency || sysCurrency3 }));
  }
  const updatedDoc = { ...updated, updatedAt: Date.now() };
  if (activeYear) {
      updatedDoc.fiscalYearId = activeYear.id;
  }
  try {
     const saved = await updateLocalData('accounting_documents', id, updatedDoc);
     return saved;
  } catch (e) {
     return null;
  }
};
export const deleteAccountingDocument = async (id: string | number) => {
  const docs = await getAccountingDocuments();
  const index = docs.findIndex((x: any) => x.id?.toString() === id?.toString());
  if (index !== -1) {
    if (docs[index].isAutoGenerated) {
       throw new Error('اسناد اتوماتیک قابل حذف دستی نیستند.');
    }
    await updateLocalData('accounting_documents', id, { ...docs[index], isDeleted: true });
  }
};

export const syncCheckAccountingDocument = async (checkType: 'issued' | 'received', check: any, previousCheck?: any) => {
  try {
    const ledgerAccounts = await getLedgerAccounts();
    const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';
    const getAccountForCode = async (code: string, fallbackTitle: string, parentCode: string, nature: 'debit' | 'credit') => {
      const parentAcc = ledgerAccounts.find(a => a.code === parentCode);
      let acc = ledgerAccounts.find(a => a.code === code);
      if (acc) return acc.id;
      if (parentAcc) {
          const newAcc = { id: generateId(), code: code, title: fallbackTitle, type: 'subsidiary', nature, parentId: parentAcc.id };
          await addLedgerAccount(newAcc);
          ledgerAccounts.push(newAcc);
          return newAcc.id;
      }
      return defaultLedger;
    };
    const notesReceivableId = await getAccountForCode('1201', 'اسناد دریافتنی نزد صندوق', '12', 'debit');
    const inProcessNotesReceivableId = await getAccountForCode('1202', 'اسناد در جریان وصول', '12', 'debit');
    const notesPayableId = await getAccountForCode('2101', 'اسناد پرداختنی', '21', 'credit');
    const amount = Number(check.amount) || 0;
    const formattedAmount = amount.toLocaleString('fa-IR');
    const sysSettings = await getStoreSettings();
    const currency = check.currency || sysSettings?.currency || 'تومان';
    
    let personName = 'نامشخص';
    let personLedgerId = defaultLedger;
    const personId = checkType === 'issued' ? check.payeeId : check.payerId;
    if (personId) {
      const persons = await getLocalData<any[]>('persons', []);
      const person = persons.find(p => String(p.id) === String(personId));
      if (person) {
        personName = person.name || person.alias || 'نامشخص';
        if (person.accountingCode) {
          const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
          if (acc) personLedgerId = acc.id;
        } else {
          const fallbackCode = checkType === 'issued' ? '21' : '1103';
          const acc = ledgerAccounts.find(a => a.code === fallbackCode);
          if (acc) personLedgerId = acc.id;
        }
      }
    }

    let bankName = 'نامشخص';
    let bankLedgerId = defaultLedger;
    let bankAccountId = check.bankAccountId || check.accountId;
    if (checkType === 'issued' && check.checkbookId) {
      const checkbooks = await getLocalData<any[]>('checkbooks', []);
      const cb = checkbooks.find(c => String(c.id) === String(check.checkbookId));
      if (cb && cb.accountId) {
        bankAccountId = cb.accountId;
      }
    }

    const checkBank = check.bankName || check.checkBankName || bankName || 'نامشخص';
    const checkNo = check.checkNumber || check.number || 'نامشخص';
    const dueDate = check.dueDate || check.checkDueDate || 'نامشخص';
    const issueDate = checkType === 'issued' ? (check.issueDate || check.issuedDate || check.date || new Date().toISOString()) : (check.receiveDate || check.date || new Date().toISOString()); 

    const initDescription = checkType === 'issued'
      ? `صدور چک شماره ${checkNo} عهده بانک ${checkBank} به مبلغ ${formattedAmount} ${currency} به سررسید ${dueDate} در وجه طرف حساب: ${personName}`
      : `دریافت چک شماره ${checkNo} عهده بانک ${checkBank} به مبلغ ${formattedAmount} ${currency} به سررسید ${dueDate} از طرف حساب: ${personName}`;

    const initItems = [];
    if (checkType === 'issued') {
      initItems.push({ description: `طرف حساب ${personName} بابت صدور چک شماره ${checkNo} عهده بانک ${checkBank} به سررسید ${dueDate}`, debit: amount, credit: 0, ledgerAccountId: personLedgerId, detailedAccountId: personId});
      initItems.push({ description: `اسناد پرداختنی تجاری بابت صدور چک شماره ${checkNo} در وجه ${personName}`, debit: 0, credit: amount, ledgerAccountId: notesPayableId});
    } else {
      initItems.push({ description: `اسناد دریافتنی تجاری بابت دریافت چک شماره ${checkNo} از ${personName}`, debit: amount, credit: 0, ledgerAccountId: notesReceivableId});
      initItems.push({ description: `طرف حساب ${personName} بابت دریافت چک شماره ${checkNo} عهده بانک ${checkBank} به سررسید ${dueDate}`, debit: 0, credit: amount, ledgerAccountId: personLedgerId, detailedAccountId: personId});
    }

    const existingDocs = await getAccountingDocuments();
    const doc = existingDocs.find(d => d.sourceType === `check_${checkType}_init` && String(d.sourceId) === String(check.id));
    
    if (doc) {
      await updateAccountingDocument(doc.id, {
        ...doc,
        date: issueDate,
        description: initDescription,
        items: initItems});
    } else {
      await addAccountingDocument({
        date: issueDate,
        description: initDescription,
        status: 'approved',
        sourceType: `check_${checkType}_init`,
        sourceId: check.id,
        isAutoGenerated: true,
        items: initItems});
    }

    // 2. Status Transition Document
    const status = check.status || 'pending';
    const statusDocType = `check_${checkType}_status`;
    const statusDocSourceId = `${check.id}_${status}`;

    // Clear old status documents
    const statusDocs = existingDocs.filter(d => d.sourceType === statusDocType && String(d.sourceId).startsWith(String(check.id)));
    for (const d of statusDocs) {
      if (status === 'pending' || d.sourceId !== statusDocSourceId) {
        await updateLocalData('accounting_documents', d.id, { ...d, isDeleted: true });
      }
    }

    if (status !== 'pending') {
      const statusItems = [];
      let statusDescription = '';
      if (status === 'deposited') {
        if (checkType === 'received') {
          statusDescription = `واگذاری چک دریافتی شماره ${checkNo} به حساب بانک ${bankName} (در جریان وصول)`;
          statusItems.push({
            description: `اسناد در جریان وصول بابت واگذاری چک شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: inProcessNotesReceivableId});
          statusItems.push({
            description: `اسناد دریافتنی نزد صندوق بابت واگذاری چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: notesReceivableId});
        }
      } else if (status === 'cashed') {
        if (checkType === 'issued') {
          statusDescription = `وصول چک صادره شماره ${checkNo} عهده بانک ${checkBank} به مبلغ ${formattedAmount} ${currency} و کسر از حساب بانک`;
          statusItems.push({
            description: `اسناد پرداختنی بابت وصول چک شماره ${checkNo} عهده بانک ${checkBank}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: notesPayableId});
          statusItems.push({
            description: `بانک ${bankName} بابت کسر از حساب جهت وصول چک صادره شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: bankLedgerId});
        } else {
          statusDescription = `وصول چک دریافتی شماره ${checkNo} عهده بانک ${checkBank} به مبلغ ${formattedAmount} ${currency} و واریز به حساب بانک ${bankName}`;
          // Step 2: In process
          statusItems.push({
            description: `اسناد در جریان وصول بابت واگذاری چک شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: inProcessNotesReceivableId});
          statusItems.push({
            description: `اسناد دریافتنی نزد صندوق بابت واگذاری چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: notesReceivableId});
          // Step 3: Cashed
          statusItems.push({
            description: `بانک ${bankName} بابت واریز وجه چک وصول شده شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: bankLedgerId});
          statusItems.push({
            description: `اسناد در جریان وصول بابت وصول چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: inProcessNotesReceivableId});
        }
      } else if (status === 'cancelled') {
        if (checkType === 'issued') {
          statusDescription = `ابطال چک صادره شماره ${checkNo} عهده بانک ${checkBank} به مبلغ ${formattedAmount} ${currency} و برگشت بدهی طرف حساب: ${personName}`;
          statusItems.push({
            description: `اسناد پرداختنی بابت ابطال چک شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: notesPayableId});
          statusItems.push({
            description: `طرف حساب ${personName} بابت برگشت بدهی پس از ابطال چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: personLedgerId,
            detailedAccountId: personId});
        }
      } else if (status === 'assigned') {
        if (checkType === 'received') {
          const persons = await getLocalData<any[]>('persons', []);
          const assignedPersonName = (persons.find((p: any) => String(p.id) === String(check.assignedToId)) || {name: check.assignedToId}).name;
          statusDescription = `خرج چک دریافتی شماره ${checkNo} عهده بانک ${checkBank} به شخص ${assignedPersonName}`;
          statusItems.push({
            description: `بدهکار - شخص (حساب پرداختنی) بابت خرج چک ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: (ledgerAccounts.find((a: any) => String(a.code).startsWith('21') || String(a.code) === '21') || {id: 0}).id,
            detailedAccountId: check.assignedToId});
          statusItems.push({
            description: `بستانکار - اسناد دریافتنی بابت خرج چک ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: notesReceivableId});
        }
      } else if (status === 'bounced_assigned') {
        if (checkType === 'received') {
          const persons = await getLocalData<any[]>('persons', []);
          const assignedPersonName = (persons.find((p: any) => String(p.id) === String(check.assignedToId)) || {name: check.assignedToId}).name;
          statusDescription = `برگشت چک خرج شده شماره ${checkNo} از شخص ${assignedPersonName}`;
          statusItems.push({
            description: `بدهکار - اسناد دریافتنی بابت برگشت چک خرج شده ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: notesReceivableId});
          statusItems.push({
            description: `بستانکار - شخص (حساب پرداختنی) بابت برگشت چک خرج شده ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: (ledgerAccounts.find((a: any) => String(a.code).startsWith('21') || String(a.code) === '21') || {id: 0}).id,
            detailedAccountId: check.assignedToId});
        }
      } else if (status === 'returned' || status === 'bounced' || status === 'rejected') {
        if (checkType === 'issued') {
          // هیچ سند حسابداری برای برگشت چک پرداختی ثبت نمی‌شود (تعهد همچنان باقیست)
        } else {
          statusDescription = `برگشت چک دریافتی شماره ${checkNo} عهده بانک ${checkBank} و برگشت از شخص`;
          // Step 2: In process
          statusItems.push({
            description: `اسناد در جریان وصول بابت واگذاری چک شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: inProcessNotesReceivableId});
          statusItems.push({
            description: `اسناد دریافتنی نزد صندوق بابت واگذاری چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: notesReceivableId});
          // Step 3: Returned
          statusItems.push({
            description: `طرف حساب ${personName} بابت برگشت چک شماره ${checkNo}`,
            debit: amount,
            credit: 0,
            ledgerAccountId: personLedgerId,
            detailedAccountId: personId});
          statusItems.push({
            description: `اسناد در جریان وصول بابت برگشت چک شماره ${checkNo}`,
            debit: 0,
            credit: amount,
            ledgerAccountId: inProcessNotesReceivableId});
        }
      }

      if (statusItems.length > 0) {
        const existingStatusDoc = existingDocs.find(d => d.sourceType === statusDocType && String(d.sourceId) === statusDocSourceId);
        if (existingStatusDoc) {
          await updateAccountingDocument(existingStatusDoc.id, {
            ...existingStatusDoc,
            date: new Date().toISOString(),
            description: statusDescription,
            items: statusItems});
        } else {
          await addAccountingDocument({
            date: new Date().toISOString(),
            description: statusDescription,
            status: 'approved',
            sourceType: statusDocType,
            sourceId: statusDocSourceId,
            isAutoGenerated: true,
            items: statusItems});
        }
      }
    }
  } catch (e) {
    console.error("Error syncing check accounting doc:", e);
  }
};

export const getInstallments = async () => getLocalData<any[]>('installments', []);
export const saveInstallments = async (installments: any[]) => {
  const activeYear = await getActiveFinancialYear();
  const processed = [];
  for (const inst of installments) {
    let fiscalYearId = inst.fiscalYearId;
    if (!fiscalYearId) {
      if (inst.dueDate) {
        try {
          const yr = await checkFinancialYear(inst.dueDate);
          if (yr) fiscalYearId = yr.id;
        } catch (e) {
          if (activeYear) fiscalYearId = activeYear.id;
        }
      } else if (activeYear) {
        fiscalYearId = activeYear.id;
      }
    }
    processed.push({ ...inst, fiscalYearId });
  }
  await saveLocalData('installments', processed);
};

export const getSystemLogs = async () => {
  const logs = await getLocalData<any[]>('system_logs', [], { limit: 50 });
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

export const addSystemLog = async (action, details, entityType, entityId) => {
  // Backend automatically handles system_logs on POST /api/data/:key
  // We make this a no-op to prevent huge performance overhead and duplicate logs
  return { id: generateId(), action, userId: 'system', details, entityType, entityId, timestamp: Date.now() };
};

// --- SMS Messages ---
export const getSmsMessages = async (): Promise<any[]> => {
  return await getLocalData<any[]>('sms_messages', []);
};

export const addSmsMessage = async (message: any): Promise<void> => {
  const messages = await getSmsMessages();
  messages.push(message);
  await saveLocalData('sms_messages', messages);
};

export const deleteSmsMessage = async (id: string): Promise<void> => {
  const messages = await getSmsMessages();
  await saveLocalData('sms_messages', messages.filter(m => m.id !== id));
};

// --- Persons Opening Balances ---
export const getPersonOpeningBalances = async () => {
  const balances = await getLocalData<any[]>('person_opening_balances', []);
  return balances.sort((a, b) => b.createdAt - a.createdAt);
};

export const addPersonOpeningBalance = async (balanceDoc: any) => {
  const balances = await getLocalData<any[]>('person_opening_balances', []);
  const now = Date.now();
  let activeYear = null;
  if (balanceDoc.date) activeYear = await checkFinancialYear(balanceDoc.date);
  const newBalance = { ...balanceDoc, id: generateId(), createdAt: now, updatedAt: now, fiscalYearId: activeYear ? activeYear.id : undefined };
  balances.push(newBalance);
  await saveLocalData('person_opening_balances', balances);
  
  // Sync with person collection
  const persons = await getLocalData<any[]>('persons', []);
  const idx = persons.findIndex((p: any) => String(p.id) === String(balanceDoc.personId));
  let personName = '';
  if (idx !== -1) {
    personName = persons[idx].name;
    persons[idx].initialBalance = Number(balanceDoc.amount || 0);
    persons[idx].initialBalanceType = balanceDoc.balanceType || "settled";
    persons[idx].updatedAt = now;
    await saveLocalData('persons', persons);
  }

  // Auto-generate basic accounting document
  try {
     const ledgerAccounts = await getLedgerAccounts();
     const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';
     let personLedgerId = defaultLedger;
     if (balanceDoc.personId) {
        const person = persons.find(p => String(p.id) === String(balanceDoc.personId));
        if (person && person.accountingCode) {
           const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
           if (acc) personLedgerId = acc.id;
        }
     }

     const items = [];
     if (balanceDoc.balanceType === 'debtor') {
        items.push({ description: 'طرف حساب', debit: Number(balanceDoc.amount), credit: 0, ledgerAccountId: personLedgerId, detailedAccountId: balanceDoc.personId});
        items.push({ description: 'تراز افتتاحیه', debit: 0, credit: Number(balanceDoc.amount), ledgerAccountId: defaultLedger});
     } else {
        items.push({ description: 'تراز افتتاحیه', debit: Number(balanceDoc.amount), credit: 0, ledgerAccountId: defaultLedger});
        items.push({ description: 'طرف حساب', debit: 0, credit: Number(balanceDoc.amount), ledgerAccountId: personLedgerId, detailedAccountId: balanceDoc.personId});
     }
     
     await addAccountingDocument({
        date: balanceDoc.date || new Date().toISOString().split('T')[0],
        description: balanceDoc.description || `سند افتتاحیه طرف حساب: ${personName}`,
        status: 'approved',
        sourceType: 'opening_balance',
        sourceId: balanceDoc.personId,
        items});
  } catch(e) {}

  if (typeof addSystemLog !== 'undefined') {
    await addSystemLog('ADD_PERSON_OPENING_BALANCE', `ثبت سند افتتاحیه جدید برای شخص ${balanceDoc.personId}`, 'PersonOpeningBalance', newBalance.id);
  }

  return newBalance;
};

export const updatePersonOpeningBalance = async (id: string, balanceDoc: any) => {
  const balances = await getLocalData<any[]>('person_opening_balances', []);
  const index = balances.findIndex((b: any) => String(b.id) === String(id));
  if (index !== -1) {
    const oldBalance = balances[index];
    const now = Date.now();
    let activeYear = null;
    if (balanceDoc.date) activeYear = await checkFinancialYear(balanceDoc.date);
    const updatedBalance = { ...oldBalance, ...balanceDoc, updatedAt: now };
    if (activeYear) updatedBalance.fiscalYearId = activeYear.id;
    balances[index] = updatedBalance;
    await saveLocalData('person_opening_balances', balances);

    // Sync with person collection
    const persons = await getLocalData<any[]>('persons', []);
    const idx = persons.findIndex((p: any) => String(p.id) === String(updatedBalance.personId));
    let personName = '';
    if (idx !== -1) {
      personName = persons[idx].name;
      persons[idx].initialBalance = Number(updatedBalance.amount || 0);
      persons[idx].initialBalanceType = updatedBalance.balanceType || "settled";
      persons[idx].updatedAt = now;
      await saveLocalData('persons', persons);
    }

    // Update auto-generated accounting document
    try {
       const accountingDocs = await getAccountingDocuments();
       const existingDoc = accountingDocs.find((d: any) => d.sourceType === 'opening_balance' && String(d.sourceId) === String(updatedBalance.personId));
       
       const ledgerAccounts = await getLedgerAccounts();
       const defaultLedger = ledgerAccounts.length > 0 ? ledgerAccounts[0].id : '';
       let personLedgerId = defaultLedger;
       if (updatedBalance.personId) {
          const person = persons.find(p => String(p.id) === String(updatedBalance.personId));
          if (person && person.accountingCode) {
             const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
             if (acc) personLedgerId = acc.id;
          }
       }

       const items = [];
       if (updatedBalance.balanceType === 'debtor') {
          items.push({ description: 'طرف حساب', debit: Number(updatedBalance.amount), credit: 0, ledgerAccountId: personLedgerId, detailedAccountId: updatedBalance.personId});
          items.push({ description: 'تراز افتتاحیه', debit: 0, credit: Number(updatedBalance.amount), ledgerAccountId: defaultLedger});
       } else {
          items.push({ description: 'تراز افتتاحیه', debit: Number(updatedBalance.amount), credit: 0, ledgerAccountId: defaultLedger});
          items.push({ description: 'طرف حساب', debit: 0, credit: Number(updatedBalance.amount), ledgerAccountId: personLedgerId, detailedAccountId: updatedBalance.personId});
       }

       if (existingDoc) {
          await updateAccountingDocument(existingDoc.id, {
             ...existingDoc,
             date: updatedBalance.date || existingDoc.date,
             description: updatedBalance.description || `سند افتتاحیه طرف حساب: ${personName}`,
             items});
       } else {
          await addAccountingDocument({
             date: updatedBalance.date || new Date().toISOString().split('T')[0],
             description: updatedBalance.description || `سند افتتاحیه طرف حساب: ${personName}`,
             status: 'approved',
             sourceType: 'opening_balance',
             sourceId: updatedBalance.personId,
             items});
       }
    } catch(e) {}

    if (typeof addSystemLog !== 'undefined') {
      await addSystemLog('UPDATE_PERSON_OPENING_BALANCE', `ویرایش سند افتتاحیه شخص ${updatedBalance.personId}`, 'PersonOpeningBalance', updatedBalance.id);
    }

    return updatedBalance;
  }
  return null;
};

export const deletePersonOpeningBalance = async (id: string) => {
  const balances = await getLocalData<any[]>('person_opening_balances', []);
  const doc = balances.find((b: any) => String(b.id) === String(id));
  if (doc) {
    const personId = doc.personId;
    await saveLocalData('person_opening_balances', balances.filter((b: any) => String(b.id) !== String(id)));

    // Sync with person collection - reset to settled
    const persons = await getLocalData<any[]>('persons', []);
    const idx = persons.findIndex((p: any) => String(p.id) === String(personId));
    if (idx !== -1) {
      persons[idx].initialBalance = 0;
      persons[idx].initialBalanceType = "settled";
      persons[idx].updatedAt = Date.now();
      await saveLocalData('persons', persons);
    }

    // Delete auto-generated accounting document
    try {
       const accountingDocs = await getAccountingDocuments();
       const existingDoc = accountingDocs.find((d: any) => d.sourceType === 'opening_balance' && String(d.sourceId) === String(personId));
       if (existingDoc) {
          await deleteAccountingDocument(existingDoc.id);
       }
    } catch(e) {}

    if (typeof addSystemLog !== 'undefined') {
      await addSystemLog('DELETE_PERSON_OPENING_BALANCE', `حذف سند افتتاحیه شخص ${personId}`, 'PersonOpeningBalance', id);
    }
  }
};

export const getProductPriceHistory = async (productId: string) => {
  const allHistory = await getLocalData<any[]>('product_price_history', []);
  return allHistory.filter((h: any) => String(h.productId) === String(productId));
};

export const updateProductPriceHistory = async (id: string, updatedData: any) => {
  return await updateLocalData('product_price_history', id, updatedData);
};


export const getDebtorsTrackings = async () => {
  return await getLocalData<any[]>('debtors_trackings', []);
};

export const saveDebtorsTrackings = async (data: any[]) => {
  await saveLocalData('debtors_trackings', data);
};

export const getPayslips = () => getLocalData<any[]>('payslips', []);
export const addPayslip = async (payslip: any) => {
  let activeYear = null;
  if (payslip.date) {
    try {
      activeYear = await checkFinancialYear(payslip.date);
    } catch (e) {
      activeYear = await getActiveFinancialYear();
    }
  } else {
    activeYear = await getActiveFinancialYear();
  }
  const newItem = { ...payslip, fiscalYearId: activeYear ? activeYear.id : undefined };
  return appendLocalData('payslips', newItem);
};
export const updatePayslip = async (id: string | number, updated: any) => {
  let activeYear = null;
  if (updated.date) {
    try {
      activeYear = await checkFinancialYear(updated.date);
    } catch (e) {
      activeYear = await getActiveFinancialYear();
    }
  } else {
    activeYear = await getActiveFinancialYear();
  }
  const updatedData = { ...updated, updatedAt: Date.now() };
  if (activeYear) updatedData.fiscalYearId = activeYear.id;
  return updateLocalData('payslips', id, updatedData);
};
export const deletePayslip = async (id: string | number) => {
  const data = await getLocalData<any[]>('payslips', []);
  await saveLocalData('payslips', data.filter(p => String(p.id) !== String(id)));
};

export const getInventoryTransactions = async (productId?: string | number, warehouseId?: string | number) => {
  const history = await getLocalData<any[]>('InventoryTransactions', []);
  let filtered = history;
  if (productId) {
    filtered = filtered.filter(h => h.productId?.toString() === productId?.toString());
  }
  if (warehouseId) {
    filtered = filtered.filter(h => h.warehouseId?.toString() === warehouseId?.toString());
  }
  return filtered.sort((a, b) => b.timestamp - a.timestamp);
};

export const getProductInventoryHistory = getInventoryTransactions;
