import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

# Change the db_type display text to PostgreSQL
# The user wants it to say Postgres
content = content.replace("{isPostgres ? 'PostgreSQL' : 'SQLite'}", "'PostgreSQL'")
content = content.replace("{isPostgres ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-50 text-slate-500 border-slate-100'}", "'bg-sky-50 text-sky-600 border-sky-100'")

# The user wants a tag for main or secondary business
old_tag = """                            {store.id === 'default' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-600 border-amber-200">
                                کسب و کار اصلی
                              </span>
                            )}"""

new_tag = """                            {store.id === 'default' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-600 border-amber-200">
                                کسب و کار اصلی
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
                                شعبه / شرکت فرعی
                              </span>
                            )}"""

content = content.replace(old_tag, new_tag)

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)

