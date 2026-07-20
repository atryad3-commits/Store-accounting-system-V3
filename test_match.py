with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

start_str = 'نام شرکت / سازمان{" "}'
start_idx = content.find(start_str)
print("Line containing this:", content.count('\n', 0, start_idx))
