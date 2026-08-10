with open('src/services/installmentPaymentService.ts', 'r') as f:
    text = f.read()

text = text.replace("date: new Date().toISOString().split('T')[0], // میلادی", "date: new Date().toISOString().split('T')[0],\n        jalaliDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),")

with open('src/services/installmentPaymentService.ts', 'w') as f:
    f.write(text)
