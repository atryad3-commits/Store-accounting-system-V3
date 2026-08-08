const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
content = content.replace(/             <\/div>\n                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">\n                   <DollarSign/g, '             </div>\n             <div className="space-y-2">\n                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">\n                   <DollarSign');
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
