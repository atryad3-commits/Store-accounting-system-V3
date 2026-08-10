with open('src/services/installmentPaymentService.ts', 'r') as f:
    text = f.read()

text = text.replace("resourceType: paymentMethodType === 'account' ? 'bank' : 'cashbox',", "method: paymentMethodType === 'account' ? 'account' : 'cash',\n        resourceType: paymentMethodType === 'account' ? 'bank' : 'cashbox',")

with open('src/services/installmentPaymentService.ts', 'w') as f:
    f.write(text)
