import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

# Change playful indigo to more formal blue/slate
content = content.replace("bg-indigo-50", "bg-blue-50")
content = content.replace("text-indigo-600", "text-blue-700")
content = content.replace("shadow-indigo-500/10", "shadow-blue-900/10")
content = content.replace("border-indigo-500", "border-blue-700")
content = content.replace("bg-indigo-500", "bg-blue-700")
content = content.replace("border-indigo-100", "border-blue-100")
content = content.replace("text-indigo-900", "text-slate-900")
content = content.replace("hover:border-indigo-300", "hover:border-blue-300")
content = content.replace("bg-indigo-600", "bg-blue-800")
content = content.replace("hover:bg-indigo-700", "hover:bg-blue-900")
content = content.replace("shadow-indigo-600/20", "shadow-blue-900/20")
content = content.replace("hover:shadow-indigo-600/30", "hover:shadow-blue-900/30")
content = content.replace("focus:ring-indigo-500/10", "focus:ring-blue-900/10")
content = content.replace("focus:border-indigo-500", "focus:border-blue-700")
content = content.replace("bg-indigo-500/10", "bg-slate-800/5")
content = content.replace("bg-blue-500/10", "bg-slate-800/5")
content = content.replace("rounded-[2rem]", "rounded-2xl")
content = content.replace("rounded-3xl", "rounded-xl")
content = content.replace("rounded-2xl", "rounded-xl")
content = content.replace("text-3xl font-black", "text-2xl font-bold")
content = content.replace("border-indigo-200", "border-blue-200")
content = content.replace("bg-indigo-50/30", "bg-blue-50/30")

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)

