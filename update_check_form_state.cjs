const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/useCheckForm.ts', 'utf8');

// Issued check states
file = file.replace(
  "  const [icCheckNumber, setIcCheckNumber] = useState('');",
  "  const [icCheckNumber, setIcCheckNumber] = useState('');\n  const [icSayadId, setIcSayadId] = useState('');\n  const [icReason, setIcReason] = useState('خرید کالا');"
);

// Received check states
file = file.replace(
  "  const [rcCheckNumber, setRcCheckNumber] = useState('');",
  "  const [rcCheckNumber, setRcCheckNumber] = useState('');\n  const [rcSayadId, setRcSayadId] = useState('');\n  const [rcReason, setRcReason] = useState('تسویه بدهی');"
);

file = file.replace(
  "const resetIssuedForm = () => {",
  "const resetIssuedForm = () => {\n    setIcSayadId('');\n    setIcReason('خرید کالا');"
);

file = file.replace(
  "const resetReceivedForm = () => {",
  "const resetReceivedForm = () => {\n    setRcSayadId('');\n    setRcReason('تسویه بدهی');"
);

// Update openIssuedModalForEdit
file = file.replace(
  "setIcCheckNumber(String(check.checkNumber));",
  "setIcCheckNumber(String(check.checkNumber));\n    setIcSayadId(check.sayadId || '');\n    setIcReason(check.reason || 'خرید کالا');"
);

// Update openReceivedModalForEdit
file = file.replace(
  "setRcCheckNumber(String(check.checkNumber));",
  "setRcCheckNumber(String(check.checkNumber));\n    setRcSayadId(check.sayadId || '');\n    setRcReason(check.reason || 'تسویه بدهی');"
);

// Update payload for handleIssueCheckSubmit
file = file.replace(
  "checkbookId: icCheckbookId || '',",
  "checkbookId: icCheckbookId || '',\n        sayadId: icSayadId,\n        reason: icReason,"
);

// Update payload for handleReceiveCheckSubmit
file = file.replace(
  "checkNumber: rcCheckNumber,",
  "checkNumber: rcCheckNumber,\n        sayadId: rcSayadId,\n        reason: rcReason,"
);

// Also need to add variables to the returned object
file = file.replace(
  "icCheckNumber, setIcCheckNumber,",
  "icCheckNumber, setIcCheckNumber,\n    icSayadId, setIcSayadId,\n    icReason, setIcReason,"
);

file = file.replace(
  "rcCheckNumber, setRcCheckNumber,",
  "rcCheckNumber, setRcCheckNumber,\n    rcSayadId, setRcSayadId,\n    rcReason, setRcReason,"
);

fs.writeFileSync('src/components/financial/checks/useCheckForm.ts', file);
