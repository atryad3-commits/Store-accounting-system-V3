import sys
import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

handle_create_old = """  const [dbType, setDbType] = useState('sqlite');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');

  const handleCreate = async () => {
    if (!newStoreName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newStoreName,
          db_type: dbType,
          db_host: dbHost,
          db_port: dbPort,
          db_name: dbName,
          db_user: dbUser,
          db_password: dbPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores([...availableStores, data.database]);
        setNewStoreName('');
        setDbType('sqlite');
        setDbHost('');
        setDbPort('');
        setDbName('');
        setDbUser('');
        setDbPassword('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };"""

handle_create_new = """  const handleCreate = async () => {
    if (!newStoreName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStoreName })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores([...availableStores, data.database]);
        setNewStoreName('');
      } else {
        alert(data.error || 'خطا در ایجاد کسب و کار');
      }
    } catch (e) {
      console.error(e);
      alert('خطا در ارتباط با سرور');
    } finally {
      setCreating(false);
    }
  };"""

content = content.replace(handle_create_old, handle_create_new)

render_old = """          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              placeholder="نام کسب و کار (مثال: شعبه تهران)"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-lg font-medium"
            />
            
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
                <label className="text-sm font-bold text-slate-700 whitespace-nowrap">نوع دیتابیس:</label>
                <select value={dbType} onChange={e => setDbType(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm">
                    <option value="sqlite">فایل محلی (SQLite)</option>
                    <option value="postgres">سرور ابری/راه دور (PostgreSQL)</option>
                </select>
            </div>

            {dbType === 'postgres' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-slate-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">آدرس سرور (Host)</label>
                        <input dir="ltr" type="text" value={dbHost} onChange={e => setDbHost(e.target.value)} placeholder="localhost" className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-left font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">پورت (Port)</label>
                        <input dir="ltr" type="text" value={dbPort} onChange={e => setDbPort(e.target.value)} placeholder="5432" className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-left font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">نام دیتابیس (DB Name)</label>
                        <input dir="ltr" type="text" value={dbName} onChange={e => setDbName(e.target.value)} placeholder="my_database" className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-left font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">نام کاربری (User)</label>
                        <input dir="ltr" type="text" value={dbUser} onChange={e => setDbUser(e.target.value)} placeholder="postgres" className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-left font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">رمز عبور (Password)</label>
                        <input dir="ltr" type="password" value={dbPassword} onChange={e => setDbPassword(e.target.value)} placeholder="********" className="w-full px-4 py-2 border rounded-lg bg-slate-50 text-left font-mono tracking-widest focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                </div>
            )}

            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim() || (dbType === 'postgres' && (!dbHost || !dbName || !dbUser))}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20 mt-2"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              ثبت و ایجاد کسب و کار جدید
            </button>
          </div>"""

render_new = """          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              placeholder="نام فروشگاه یا شرکت جدید را وارد کنید..."
              className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-lg font-medium"
            />
            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim()}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              ایجاد کسب و کار جدید
            </button>
          </div>"""

content = content.replace(render_old, render_new)

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)
