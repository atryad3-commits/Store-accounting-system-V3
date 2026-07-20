with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

old = "`شرکت ${newPersonCompanyName}`,"
new = "newPersonCompanyName ? `شرکت ${newPersonCompanyName}` : undefined,"
content = content.replace(old, new)

old2 = "`فروشگاه ${newPersonCompanyName}`"
new2 = "newPersonCompanyName ? `فروشگاه ${newPersonCompanyName}` : undefined"
content = content.replace(old2, new2)

with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
    f.write(content)
