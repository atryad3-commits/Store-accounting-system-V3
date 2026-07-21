import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

tag_addition = """<div className="flex items-center gap-2 mt-1.5">
                            {store.id === 'default' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-600 border-amber-200">
                                کسب و کار اصلی
                              </span>
                            )}"""

content = content.replace('<div className="flex items-center gap-2 mt-1.5">', tag_addition)

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)
