import re

with open("src/services/installmentPaymentService.ts", "r") as f:
    content = f.read()

bad = """    const tx = await addTransaction({
        type: txType,
        amount: amountEntered, // Actual amount received
        accountId: paymentMethodType === 'account' ? paymentMethodId : undefined,
        cashboxId: paymentMethodType === 'cashbox' ? paymentMethodId : undefined,
        personId: loan.personId,
        categoryId: loan.type === 'given' ? 'loan_installment_received' : 'loan_installment_paid',
        description: `پرداخت قسط(ها) برای کد یکتا ${installmentCode}`,
        date: today,
        time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
        isSystem: true,
    });"""

good = """    const tx = await addTransaction({
        type: txType,
        amount: amountEntered, // Actual amount received
        resourceType: paymentMethodType === 'account' ? 'bank' : 'cashbox',
        resourceId: paymentMethodId,
        accountId: paymentMethodType === 'account' ? paymentMethodId : undefined,
        cashboxId: paymentMethodType === 'cashbox' ? paymentMethodId : undefined,
        personId: loan.personId,
        categoryId: loan.type === 'given' ? 'loan_installment_received' : 'loan_installment_paid',
        description: `پرداخت قسط(ها) برای کد یکتا ${installmentCode}`,
        date: new Date().toISOString().split('T')[0], // میلادی
        time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
        isSystem: true,
    });"""

content = content.replace(bad, good)

with open("src/services/installmentPaymentService.ts", "w") as f:
    f.write(content)
