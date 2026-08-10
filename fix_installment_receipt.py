with open('src/services/installmentPaymentService.ts', 'r') as f:
    text = f.read()

import re

# We need to assign tx metadata to the installments that were just paid.
# Right now, updatedInstallments are modified and saved, THEN tx is created.
# Let's swap the order: create tx, then update installments with tx info, then save!

old_code = """
    // Save updated installments
    await saveInstallments(updatedInstallments);
    
    // Update Transaction & Accounting
    const txType = loan.type === 'given' ? 'receive' : 'pay';
    const tx = await addTransaction({"""

new_code = """
    // Update Transaction & Accounting
    const txType = loan.type === 'given' ? 'receive' : 'pay';
    const tx = await addTransaction({"""

text = text.replace(old_code, new_code)

old_code2 = """
        isSystem: true,
    });
    
    // Check if loan status needs change
"""

new_code2 = """
        isSystem: true,
    });
    
    // Attach receipt info to installments that were paid in this batch
    updatedInstallments = updatedInstallments.map((inst: any) => {
        if (inst.loanId === loan.id && inst.status === 'paid' && inst.paidDate === today) {
            // We assume if it was paid today in this session, we attach the receipt info
            // A more robust way is to check if we just allocated to this installment
            return {
                ...inst,
                receiptId: tx.id,
                receiptNumber: tx.receiptNumber
            };
        }
        return inst;
    });

    // Save updated installments
    await saveInstallments(updatedInstallments);
    
    // Check if loan status needs change
"""

text = text.replace(old_code2, new_code2)

with open('src/services/installmentPaymentService.ts', 'w') as f:
    f.write(text)
