import sys

file_path = 'src/components/loans/LoansManager.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """    if (instCount * instAmount < amountNum) {
      showNotification('مجموع اقساط نمی‌تواند کمتر از اصل وام باشد.', 'error');
      return;
    }"""
replacement1 = """    const maxRoundingDiff = instCount;
    if (instCount * instAmount < amountNum && (amountNum - (instCount * instAmount) > maxRoundingDiff)) {
      showNotification('مجموع اقساط نمی‌تواند کمتر از اصل وام باشد.', 'error');
      return;
    }"""

target2 = """    const newInstallments: Installment[] = [];
    const stepMonths = formData.frequency === 'yearly' ? 12 : formData.frequency === 'quarterly' ? 3 : 1;
    
    for (let i = 0; i < instCount; i++) {
      let totalMonths = initM + ((i + 1) * stepMonths);
      let instY = initY + Math.floor((totalMonths - 1) / 12);
      let instM = ((totalMonths - 1) % 12) + 1;
      
      let finalD = initD;
      if (instM === 12 && finalD > 29) finalD = 29;
      if (instM > 6 && finalD === 31) finalD = 30;
      let dueDateStr = instY + '-' + instM.toString().padStart(2, '0') + '-' + finalD.toString().padStart(2, '0');
      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        installmentNumber: i + 1,
        loanId: loanId,
        dueDate: dueDateStr,
        amount: instAmount,
        status: 'pending',
      });
    }"""

replacement2 = """    const newInstallments: Installment[] = [];
    const stepMonths = formData.frequency === 'yearly' ? 12 : formData.frequency === 'quarterly' ? 3 : 1;
    
    let targetTotalPayable = instAmount * instCount;
    const r = formData.interestRate === '' ? 0 : Number(formData.interestRate);
    if (r === 0) {
        if (instAmount * instCount < amountNum || instAmount === Math.round(amountNum / instCount)) {
            targetTotalPayable = amountNum;
        }
    } else {
        let freq = formData.frequency || 'monthly';
        let periodsPerYear = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1;
        let periodicRate = (r / 100) / periodsPerYear;
        let exactInstAmt = (amountNum * periodicRate * Math.pow(1 + periodicRate, instCount)) / (Math.pow(1 + periodicRate, instCount) - 1);
        if (instAmount === Math.round(exactInstAmt)) {
            targetTotalPayable = Math.round(exactInstAmt * instCount);
        }
    }
    
    let accumulated = 0;

    for (let i = 0; i < instCount; i++) {
      let totalMonths = initM + ((i + 1) * stepMonths);
      let instY = initY + Math.floor((totalMonths - 1) / 12);
      let instM = ((totalMonths - 1) % 12) + 1;
      
      let finalD = initD;
      if (instM === 12 && finalD > 29) finalD = 29;
      if (instM > 6 && finalD === 31) finalD = 30;
      let dueDateStr = instY + '-' + instM.toString().padStart(2, '0') + '-' + finalD.toString().padStart(2, '0');
      
      let currentInstAmount = instAmount;
      if (i === instCount - 1) {
          currentInstAmount = targetTotalPayable - accumulated;
      }
      accumulated += currentInstAmount;

      newInstallments.push({
        id: 'inst-' + loanId + '-' + i,
        installmentNumber: i + 1,
        loanId: loanId,
        dueDate: dueDateStr,
        amount: currentInstAmount,
        status: 'pending',
      });
    }"""

if target1 in content and target2 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
