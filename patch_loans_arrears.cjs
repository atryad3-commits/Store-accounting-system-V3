const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansArrears.tsx', 'utf8');

code = code.replace(
/import \{ AlertCircle, Clock, Search, Phone, MessageCircle \} from 'lucide-react';/,
`import { AlertCircle, Clock, Search, Phone, MessageCircle, CheckCircle } from 'lucide-react';`
);

code = code.replace(
/const loan = loans\.find\(l => l\.id === inst\.loanId\);/,
`const loan = loans.find(l => l.id === inst.loanId);
        const loanInsts = installments.filter(i => i.loanId === inst.loanId).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
        const installmentNumber = loanInsts.findIndex(i => i.id === inst.id) + 1;`
);

code = code.replace(
/inst\.installmentNumber/g,
`inst.installmentNumber`
);

code = code.replace(
/return \{[\s\S]*?\.\.\.inst,[\s\S]*?loan,[\s\S]*?person,[\s\S]*?daysOverdue/m,
`return {
          ...inst,
          loan,
          person,
          daysOverdue,
          installmentNumber`
);

fs.writeFileSync('src/components/loans/LoansArrears.tsx', code);
