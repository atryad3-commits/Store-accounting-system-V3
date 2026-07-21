import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { toast } from 'react-hot-toast';", "")

state_pattern = "const [creating, setCreating] = useState(false);"
state_replacement = "const [creating, setCreating] = useState(false);\n  const [errorMsg, setErrorMsg] = useState<string | null>(null);"

if "const [errorMsg" not in content:
    content = content.replace(state_pattern, state_replacement)

select_handler_old = """  const handleSelectStore = async (id: string) => {
    setLoading(id);
    try {
        const res = await fetch(`/api/databases/${id}/test-connection`);
        const data = await res.json();
        if (data.success) {
            onSelectStore(id);
        } else {
            toast.error(data.error || 'خطا در ارتباط با دیتابیس کسب و کار');
            setLoading(false);
        }
    } catch(e: any) {
        toast.error('خطا در ارتباط با سرور');
        setLoading(false);
    }
  };"""

select_handler_new = """  const handleSelectStore = async (id: string) => {
    setLoading(id);
    setErrorMsg(null);
    try {
        const res = await fetch(`/api/databases/${id}/test-connection`);
        const data = await res.json();
        if (data.success) {
            onSelectStore(id);
        } else {
            setErrorMsg(data.error || 'خطا در ارتباط با دیتابیس کسب و کار');
            setLoading(false);
        }
    } catch(e: any) {
        setErrorMsg('خطا در ارتباط با سرور');
        setLoading(false);
    }
  };"""

content = content.replace(select_handler_old, select_handler_new)

error_ui = """        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
               <X className="w-5 h-5 text-rose-600" />
             </div>
             <div>
               <p className="font-bold">خطا در اتصال به دیتابیس</p>
               <p className="text-sm opacity-90">{errorMsg}</p>
             </div>
             <button onClick={() => setErrorMsg(null)} className="mr-auto p-2 hover:bg-rose-100 rounded-lg transition-colors">
               <X className="w-4 h-4" />
             </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">"""

content = content.replace('        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">', error_ui)

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)

