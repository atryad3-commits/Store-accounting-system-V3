import sys

file_path = 'src/components/accounting/AccountingAutoSync.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      // Sync Loans
      for (const l of missingLoans) {
          const items = [];
          const total = Number(l.amount) || 0;
          const resourceLedgerId = getResourceLedgerAcc(l);
          if (l.type === 'given') {
              items.push({ description: 'بدهکار - وام پرداختی (شخص)', debit: total, credit: 0, ledgerAccountId: getPersonLedgerAcc(l.personId), detailedAccountId: l.personId });
              items.push({ description: 'بستانکار - منابع (بانک/صندوق)', debit: 0, credit: total, ledgerAccountId: resourceLedgerId });
          } else {
              items.push({ description: 'بدهکار - منابع (بانک/صندوق)', debit: total, credit: 0, ledgerAccountId: resourceLedgerId });
              items.push({ description: 'بستانکار - وام دریافتی (شخص)', debit: 0, credit: total, ledgerAccountId: getPersonLedgerAcc(l.personId), detailedAccountId: l.personId });
          }
          await addAccountingDocument({
              date: safeDate(l.startDate),
              description: `وام ${l.type === 'given' ? 'پرداختی' : 'دریافتی'}`,
              status: 'approved',
              sourceType: 'loan',
              sourceId: l.id,
              items
          });
          successCount++;
      }

      // Sync Installments
      for (const inst of missingInstallments) {
          const items = [];
          const total = Number(inst.paidAmount) || Number(inst.amount) || 0;
          const resourceLedgerId = getResourceLedgerAcc(inst);
          items.push({ description: 'بدهکار - تسویه قسط (صندوق/بانک)', debit: total, credit: 0, ledgerAccountId: resourceLedgerId });
          items.push({ description: 'بستانکار - وام پرداختی (یا برعکس)', debit: 0, credit: total, ledgerAccountId: defaultLedger });
          await addAccountingDocument({
              date: safeDate(inst.paidDate),
              description: `تسویه قسط`,
              status: 'approved',
              sourceType: 'installment',
              sourceId: inst.id,
              items
          });
          successCount++;
      }"""

replacement = """      // Sync Loans
      for (const l of missingLoans) {
          const items = [];
          const principal = Number(l.amount) || 0;
          const totalPayable = (Number(l.installmentAmount) * Number(l.totalInstallments)) || principal;
          const interestAmt = totalPayable > principal ? totalPayable - principal : 0;
          
          const resourceLedgerId = getResourceLedgerAcc(l);
          
          const interestIncomeAcc = getAccByCode('4') || defaultLedger;
          const interestExpenseAcc = getAccByCode('5') || defaultLedger;

          if (l.type === 'given') {
              items.push({ description: 'بدهکار - وام پرداختی (شخص)', debit: totalPayable, credit: 0, ledgerAccountId: getPersonLedgerAcc(l.personId), detailedAccountId: l.personId });
              items.push({ description: 'بستانکار - منابع (بانک/صندوق)', debit: 0, credit: principal, ledgerAccountId: resourceLedgerId });
              if (interestAmt > 0) items.push({ description: 'بستانکار - درآمد بهره', debit: 0, credit: interestAmt, ledgerAccountId: interestIncomeAcc });
          } else {
              items.push({ description: 'بدهکار - منابع (بانک/صندوق)', debit: principal, credit: 0, ledgerAccountId: resourceLedgerId });
              if (interestAmt > 0) items.push({ description: 'بدهکار - هزینه بهره', debit: interestAmt, credit: 0, ledgerAccountId: interestExpenseAcc });
              items.push({ description: 'بستانکار - وام دریافتی (شخص)', debit: 0, credit: totalPayable, ledgerAccountId: getPersonLedgerAcc(l.personId), detailedAccountId: l.personId });
          }
          await addAccountingDocument({
              date: safeDate(l.startDate),
              description: `وام ${l.type === 'given' ? 'پرداختی' : 'دریافتی'}`,
              status: 'approved',
              sourceType: 'loan',
              sourceId: l.id,
              items
          });
          successCount++;
      }

      // Sync Installments
      for (const inst of missingInstallments) {
          const items = [];
          const total = Number(inst.paidAmount) || Number(inst.amount) || 0;
          const resourceLedgerId = getResourceLedgerAcc(inst);
          const relatedLoan = loans.find(l => l.id === inst.loanId);
          const loanType = relatedLoan?.type || 'given';
          const personId = relatedLoan?.personId || '';

          if (loanType === 'given') {
              items.push({ description: 'بدهکار - تسویه قسط (صندوق/بانک)', debit: total, credit: 0, ledgerAccountId: resourceLedgerId });
              items.push({ description: 'بستانکار - وام پرداختی (شخص)', debit: 0, credit: total, ledgerAccountId: getPersonLedgerAcc(personId), detailedAccountId: personId });
          } else {
              items.push({ description: 'بدهکار - وام دریافتی (شخص)', debit: total, credit: 0, ledgerAccountId: getPersonLedgerAcc(personId), detailedAccountId: personId });
              items.push({ description: 'بستانکار - تسویه قسط (صندوق/بانک)', debit: 0, credit: total, ledgerAccountId: resourceLedgerId });
          }
          await addAccountingDocument({
              date: safeDate(inst.paidDate),
              description: `تسویه قسط`,
              status: 'approved',
              sourceType: 'installment',
              sourceId: inst.id,
              items
          });
          successCount++;
      }"""

if target in content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content.replace(target, replacement))
    print("Replaced successfully")
else:
    print("Target not found")
