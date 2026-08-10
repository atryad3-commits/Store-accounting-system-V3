import re
with open('src/components/loans/LoansManager.tsx', 'r') as f:
    text = f.read()

start_str = "{expandedLoanId !== null && ("
end_str = "/>\n        )}"

start_index = text.find(start_str)
end_index = text.find(end_str, start_index) + len(end_str)

if start_index != -1 and text.find(end_str, start_index) != -1:
    text = text[:start_index] + text[end_index:]

with open('src/components/loans/LoansManager.tsx', 'w') as f:
    f.write(text)
