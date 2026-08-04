const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/CheckModals.tsx', 'utf8');

file = file.replace(
  /<button type="submit" className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-black\/20 hover:shadow-black\/30 hover:-translate-y-0\.5 transition-all">تایید و اعمال وضعیت<\/button>/,
  '<button type="submit" disabled={statusVal === currentActualStatus} className={`w-full text-white rounded-xl py-3 text-sm font-bold shadow-lg transition-all ${statusVal === currentActualStatus ? \'bg-gray-300 shadow-none cursor-not-allowed\' : \'bg-black shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5\'}`}>تایید و اعمال وضعیت</button>'
);

fs.writeFileSync('src/components/financial/checks/CheckModals.tsx', file);
