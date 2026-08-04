const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(
  "icCheckNumber={icCheckNumber} setIcCheckNumber={setIcCheckNumber}",
  "icCheckNumber={icCheckNumber} setIcCheckNumber={setIcCheckNumber}\n              icSayadId={icSayadId} setIcSayadId={setIcSayadId}\n              icReason={icReason} setIcReason={setIcReason}"
);

file = file.replace(
  "rcCheckNumber={rcCheckNumber} setRcCheckNumber={setRcCheckNumber}",
  "rcCheckNumber={rcCheckNumber} setRcCheckNumber={setRcCheckNumber}\n              rcSayadId={rcSayadId} setRcSayadId={setRcSayadId}\n              rcReason={rcReason} setRcReason={setRcReason}"
);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
