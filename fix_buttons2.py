import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = 0
for i, line in enumerate(lines):
    if skip > 0:
        skip -= 1
        continue
    
    if "setSystemModule(\"selector\")" in line and "تغییر ماژول کاری" in lines[i+2]:
        # found the bad button block
        # the bad block is roughly lines i-1 to i+18
        # let's just insert the fixed buttons and skip the next 20 lines
        
        fixed_buttons = """                      <button
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
        new_lines.append(fixed_buttons)
        skip = 19 # we need to skip from i-1... wait, line is i.
        # Let's count how many lines to skip.
        # 1510-    <button
        # 1511-                        onClick={() => setSystemModule("selector")}
        # ...
        # 1528-                        <LayoutDashboard className="w-4 h-4" />
        # 1529-                        <span className="hidden sm:inline-block">
        # 1530-                          تغییر بخش کاری
        # 1531-                        </span>
        # 1532-                      </button>
        # That's 21 lines starting from 1511. Wait, let's just delete this whole section from 1510 to 1531.
        pass
    else:
        new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
