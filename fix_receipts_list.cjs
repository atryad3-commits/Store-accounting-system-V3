const fs = require('fs');
const file = 'src/components/financial/ReceiptsList.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove initialFilter and setFilterType
content = content.replace(
  /const initialFilter = activeTab === "list_pay_receipt" \? "pay" : "all";\s*const \[filterType, setFilterType\] = useState<'all' \| 'receive' \| 'pay'>\(initialFilter\);/,
  'const targetType = activeTab === "list_pay_receipt" ? "pay" : "receive";'
);

// 2. Fix the filter logic
content = content.replace(
  /if \(filterType !== "all" && tx\.type !== filterType\) return false;\s*if \(tx\.type !== "receive" && tx\.type !== "pay" && tx\.type !== "salary"\) return false;/,
  'if (tx.type !== targetType) return false;'
);

// 3. Fix the title
content = content.replace(
  /لیست رسیدهای دریافت و پرداخت/g,
  '{targetType === "receive" ? "لیست رسیدهای دریافت" : "لیست رسیدهای پرداخت"}'
);

// 4. Remove the filter buttons block
const filterButtonsRegex = /<div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-max">[\s\S]*?<\/div>/;
content = content.replace(filterButtonsRegex, '');

fs.writeFileSync(file, content);
