import re

with open('src/components/admin/SystemUpdatePage.tsx', 'r') as f:
    content = f.read()

replacement = """
                <div className="flex items-center gap-2 max-w-md mx-auto">
                    <input 
                        type="text" 
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="آدرس مخزن (مثال: username/repository)"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left font-sans outline-none focus:ring-2 focus:ring-indigo-500"
                        dir="ltr"
                    />
                    <button 
                        onClick={() => checkForUpdates()}
                        disabled={checkingUpdateVersion || !repoUrl}
                        className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors disabled:opacity-70">
                        بررسی مخزن
                    </button>
                </div>
"""

# I will replace the dummy input and button with this one
# Let's use regex to find the div with "flex items-center gap-2 max-w-md mx-auto"
content = re.sub(r'<div className="flex items-center gap-2 max-w-md mx-auto">.*?</div>', replacement.strip(), content, flags=re.DOTALL)

with open('src/components/admin/SystemUpdatePage.tsx', 'w') as f:
    f.write(content)
