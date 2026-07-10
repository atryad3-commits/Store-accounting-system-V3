import React, { useState, useEffect } from 'react';
import { Database, Server, DatabaseBackup, Loader2, CheckCircle2, XCircle, UserPlus, Building, ArrowRight, ArrowLeft } from 'lucide-react';

const SERVER_PRESETS = [
  { label: 'Cloud SQL / Remote Server', value: '' },
  { label: 'Localhost (Docker/Local)', value: 'postgresql://postgres:postgres@localhost:5432' },
  { label: 'Docker Postgres Service', value: 'postgresql://postgres:postgres@postgres:5432' },
  { label: 'SQLite (Local Database)', value: 'sqlite' },
];

export default function InitialSetupWizard({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<{
     dbConfigured: boolean;
     usingEnvVars: boolean;
     adminConfigured: boolean;
     companyConfigured: boolean;
     isComplete: boolean;
     companyProfile?: { companyName?: string; phone?: string } | null;
     adminUser?: { username?: string } | null;
  }>({
     dbConfigured: false,
     usingEnvVars: false,
     adminConfigured: false,
     companyConfigured: false,
     isComplete: false,
     companyProfile: null,
     adminUser: null
  });

  // Step 1: DB
  const [connectionString, setConnectionString] = useState(SERVER_PRESETS[3].value); // Default SQLite
  const [dbName, setDbName] = useState('store_db');
  const [dbTesting, setDbTesting] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  // Step 2: Admin
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Step 3: Company
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus(true);
  }, []);

  const checkStatus = (isInitialLoad = false) => {
    fetch('/api/setup/status')
      .then(r => r.json())
      .then(data => {
        setStatus(data);
        if (data.companyProfile) {
          if (data.companyProfile.companyName) setCompanyName(data.companyProfile.companyName);
          if (data.companyProfile.phone) setCompanyPhone(data.companyProfile.phone);
        }
        if (data.adminUser?.username) {
          setAdminUsername(data.adminUser.username);
        }
        
        setNeedsSetup(true);
        if (data.isComplete) {
          onComplete();
        } else {
          if (!data.dbConfigured) setStep(1);
          else if (!data.adminConfigured) setStep(2);
          // removed company config step
        }
      })
      .catch(() => {
        setNeedsSetup(true);
        setStep(1);
      })
      .finally(() => setLoading(false));
  };

  const handleTestDb = async () => {
    if (connectionString === 'sqlite') {
       setDbTestResult({ success: true, message: 'SQLite به صورت محلی ذخیره می‌شود و نیاز به تست ندارد.' });
       return;
    }
    setDbTesting(true);
    setDbTestResult(null);
    try {
      const res = await fetch('/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString, dbName })
      });
      const data = await res.json();
      setDbTestResult({ success: data.success, message: data.message || data.error });
    } catch (err: any) {
      setDbTestResult({ success: false, message: err.message });
    } finally {
      setDbTesting(false);
    }
  };

  const handleSaveDb = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/db/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString, dbName, engine: connectionString === 'sqlite' ? 'sqlite' : 'postgres' })
      });
      const data = await res.json();
      if (data.success) {
        checkStatus();
      } else {
        setError(data.error || 'خطا در اتصال به پایگاه داده');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/setup/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      const data = await res.json();
      if (data.success) {
        checkStatus();
      } else {
        setError(data.error || 'خطا در ثبت مدیر');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/setup/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, phone: companyPhone })
      });
      const data = await res.json();
      if (data.success) {
        checkStatus();
      } else {
        setError(data.error || 'خطا در ثبت اطلاعات کسب و کار');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dir-rtl">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!needsSetup) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dir-rtl" style={{ direction: 'rtl' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        
        {/* Steps indicator */}
        {step > 0 && (
          <div className="flex justify-between mb-8 relative">
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
             {[1, 2].map(s => (
               <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                 {s}
               </div>
             ))}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 p-4 rounded-full">
                <Database className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">تنظیمات پایگاه داده</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              برای شروع، سرور پایگاه داده خود را انتخاب و اطلاعات اتصال را وارد کنید.
            </p>

            {status.usingEnvVars && (
               <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-2">
                  <DatabaseBackup className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>سیستم از طریق متغیرهای محیطی به دیتابیس متصل است. در صورت تمایل می‌توانید به مرحله بعد بروید.</div>
               </div>
            )}

            <form onSubmit={handleSaveDb} className="space-y-4">
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">نوع سرور</label>
                 <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-mono"
                    value={connectionString}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== undefined) setConnectionString(val);
                    }}
                 >
                    {SERVER_PRESETS.map((preset, i) => (
                      <option key={i} value={preset.value}>{preset.label}</option>
                    ))}
                 </select>
              </div>

              {connectionString !== 'sqlite' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رشته اتصال پایه
                    </label>
                    <div className="relative">
                      <Server className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="postgresql://user:password@localhost:5432"
                        value={connectionString}
                        onChange={e => setConnectionString(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-left text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نام پایگاه داده
                    </label>
                    <div className="relative">
                      <Database className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="store_db"
                        value={dbName}
                        onChange={e => setDbName(e.target.value)}
                        className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-left text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {dbTestResult && (
                <div className={`p-3 rounded-xl text-sm flex items-start gap-2 ${dbTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {dbTestResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <div>{dbTestResult.message}</div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleTestDb}
                  disabled={dbTesting || !connectionString}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {dbTesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تست'}
                </button>
                <button
                  type="submit"
                  disabled={saving || !connectionString}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ثبت'}
                </button>
                {status.usingEnvVars && (
                   <button
                     type="button"
                     onClick={() => setStep(2)}
                     className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
                   >
                     مرحله بعد <ArrowLeft className="w-4 h-4" />
                   </button>
                )}
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-left-4 fade-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 p-4 rounded-full">
                <UserPlus className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">ایجاد حساب مدیر</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              اطلاعات ورود برای مدیر اصلی سیستم را وارد کنید.
            </p>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">نام کاربری</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-left text-sm"
                    dir="ltr"
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">رمز عبور</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-left text-sm tracking-widest"
                    dir="ltr"
                  />
               </div>
               <button
                  type="submit"
                  disabled={saving || !adminUsername || !adminPassword}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تکمیل نصب سیستم'}
                </button>
            </form>
          </div>
        )}

        </div></div>);}