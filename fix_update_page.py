import re

with open('src/components/admin/SystemUpdatePage.tsx', 'r') as f:
    content = f.read()

replacement = """
            <div className="w-full max-w-2xl text-center space-y-4 mb-8 p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Github className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                <p className="text-xs text-slate-500 font-extrabold leading-relaxed mb-4">
                    با وارد کردن آدرس مخزن گیت‌هاب پروژه، می‌توانید آخرین تغییرات را مشاهده کرده و در صورت نیاز سیستم خود را به روز رسانی کنید.
                </p>
                <div className="flex items-center gap-2 max-w-md mx-auto">
                    <input 
                        type="text" 
                        placeholder="آدرس مخزن (مثال: username/repository)"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left font-sans outline-none focus:ring-2 focus:ring-indigo-500"
                        dir="ltr"
                    />
                    <button className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors">
                        بررسی مخزن
                    </button>
                </div>
                </div>
            </div>
"""

content = content.replace(
'''            <div className="w-full max-w-2xl text-center space-y-4 mb-8 p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Github className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                <p className="text-xs text-slate-500 font-extrabold leading-relaxed">
                    با وارد کردن آدرس مخزن گیت‌هاب پروژه، می‌توانید آخرین تغییرات را مشاهده کرده و در صورت نیاز سیستم خود را به روز رسانی کنید.
                </p>
                </div>
            </div>''', replacement)

with open('src/components/admin/SystemUpdatePage.tsx', 'w') as f:
    f.write(content)

