import sys

file_path = 'src/components/loans/LoanStatusModal.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "onChange={(e) => setStatus(e.target.value)}"
replacement = "onChange={(e) => setStatus(e.target.value as any)}"

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
