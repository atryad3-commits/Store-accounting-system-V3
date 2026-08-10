with open('src/types.ts', 'r') as f:
    text = f.read()

text = text.replace("installmentCode?: string; };", "installmentCode?: string; receiptId?: string | number; receiptNumber?: string; };")

with open('src/types.ts', 'w') as f:
    f.write(text)
