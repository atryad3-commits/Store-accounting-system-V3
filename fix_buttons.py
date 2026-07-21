import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

bad_buttons = """    <button
                        onClick={() => setSystemModule("selector")}
                        className="px-3 py-2 border rounded-xl transition-all cursor-pointer font-black gap-2 flex items-center text-xs shadow-3xs active:scale-95 text-slate-600 hover:text-emerald-700 bg-white border-emerald-200"
                        title="تغییر ماژول کاری"
                      >
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

                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline-block">
                          تغییر بخش کاری
                        </span>
                      </button>"""

fixed_buttons = """    <button
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
                      </button>"""

content = content.replace(bad_buttons, fixed_buttons)

with open('src/App.tsx', 'w') as f:
    f.write(content)
