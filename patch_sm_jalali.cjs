const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

code = code.split("jalaliDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-')").join("jalaliDate: dates?.paymentDate ? dates.paymentDate : new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-')");

fs.writeFileSync('src/services/loanStateMachine.ts', code);
