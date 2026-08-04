const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/useCheckForm.ts', 'utf8');

// For issued checks
file = file.replace(
  /await updateIssuedCheck\(updatingCheckId\.toString\(\), \{ \.\.\.existing, status: statusVal as any, bankAccountId: statusVal === 'cashed' \? depositAccountId : existing\.bankAccountId \}\);/,
  `try {
          await updateIssuedCheck(updatingCheckId.toString(), { ...existing, status: statusVal as any, bankAccountId: statusVal === 'cashed' ? depositAccountId : existing.bankAccountId });
        } catch(err: any) {
          notify(err.message || 'خطا در تغییر وضعیت چک', 'error');
          return;
        }`
);

// For received checks
file = file.replace(
  /await updateReceivedCheck\(updatingCheckId\.toString\(\), \{ \.\.\.existing, status: statusVal as any, assignedToId: statusVal === 'assigned' \? assignedVendorId : existing\.assignedToId, accountId: statusVal === 'cashed' \|\| statusVal === 'deposited' \? depositAccountId : existing\.accountId \}\);/,
  `try {
          await updateReceivedCheck(updatingCheckId.toString(), { ...existing, status: statusVal as any, assignedToId: statusVal === 'assigned' ? assignedVendorId : existing.assignedToId, accountId: statusVal === 'cashed' || statusVal === 'deposited' ? depositAccountId : existing.accountId });
        } catch(err: any) {
          notify(err.message || 'خطا در تغییر وضعیت چک', 'error');
          return;
        }`
);

fs.writeFileSync('src/components/financial/checks/useCheckForm.ts', file);
