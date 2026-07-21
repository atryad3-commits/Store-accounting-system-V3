import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

btn = """
                      <button
                        onClick={() => {
                           appState.setIsStoreSelectionOpen(true);
                        }}
                        className="px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-700 bg-white border-indigo-200"
                        title="تغییر کسب و کار"
                      >
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline-block">
                          تغییر فروشگاه
                        </span>
                      </button>
"""

content = content.replace("<LayoutDashboard className=\"w-4 h-4\" />", btn + "\n                        <LayoutDashboard className=\"w-4 h-4\" />")

with open('src/App.tsx', 'w') as f:
    f.write(content)
