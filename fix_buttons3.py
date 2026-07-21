import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

# let's just find the Calculator button and the user block and replace everything in between.
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "<Calculator className=\"w-5 h-5\" />" in line:
        start_idx = i + 2  # The closing </button> is i+1
    if "{user && (" in line and "hidden md:flex items-center gap-3 ml-4" in lines[i+1]:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    new_buttons = """
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
                      <button
                        onClick={() => setSystemModule("selector")}
                        className="px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-emerald-700 bg-white border-emerald-200"
                        title="تغییر ماژول کاری"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline-block">
                          تغییر بخش کاری
                        </span>
                      </button>
"""
    lines = lines[:start_idx] + [new_buttons] + lines[end_idx:]
    with open('src/App.tsx', 'w') as f:
        f.writelines(lines)
