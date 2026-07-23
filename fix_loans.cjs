const fs = require('fs');
let file = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');
file = file.replace(/showNotification/g, 'window.dispatchEvent(new CustomEvent("show-notification", { detail: { message: "انجام شد", type: "success" } }))'); // No wait, I don't know what `showNotification` signature was. Wait, let me look at `src/components/loans/LoansManager.tsx` for how it is imported or where it came from.
