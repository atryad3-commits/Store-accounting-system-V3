import sys

file_path = 'src/components/accounting/AccountingAutoSync.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "const activeYear = await getActiveFinancialYear();"
replacement = """const activeYear = await getActiveFinancialYear();
      const allLoans = await getLoans();"""

target_inst = "const relatedLoan = loans.find(l => l.id === inst.loanId);"
replacement_inst = "const relatedLoan = allLoans.find((l: any) => l.id === inst.loanId);"

if target in content and target_inst in content:
    content = content.replace(target, replacement)
    content = content.replace(target_inst, replacement_inst)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
