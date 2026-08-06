const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

code = code.replace(
/description: \`دریافت وجه به مبلغ \$\{formattedAmount\} واریز به \$\{resourceName\} بابت رسید دریافت شماره \$\{updated\.receiptNumber \|\| updated\.id\}\`/g,
`description: updated.description ? updated.description + \` - مبلغ \${formattedAmount} واریز به \${resourceName}\` : \`دریافت وجه به مبلغ \${formattedAmount} واریز به \${resourceName} بابت رسید دریافت شماره \${updated.receiptNumber || updated.id}\``
);

code = code.replace(
/description: \`طرف حساب \$\{personName\} به مبلغ \$\{formattedAmount\} بابت رسید دریافت شماره \$\{updated\.receiptNumber \|\| updated\.id\}\`/g,
`description: updated.description ? updated.description + \` - طرف حساب \${personName}\` : \`طرف حساب \${personName} به مبلغ \${formattedAmount} بابت رسید دریافت شماره \${updated.receiptNumber || updated.id}\``
);

code = code.replace(
/description: \`طرف حساب \$\{personName\} به مبلغ \$\{formattedAmount\} بابت رسید پرداخت شماره \$\{updated\.receiptNumber \|\| updated\.id\}\`/g,
`description: updated.description ? updated.description + \` - طرف حساب \${personName}\` : \`طرف حساب \${personName} به مبلغ \${formattedAmount} بابت رسید پرداخت شماره \${updated.receiptNumber || updated.id}\``
);

code = code.replace(
/description: \`پرداخت وجه به مبلغ \$\{formattedAmount\} از \$\{resourceName\} بابت رسید شماره \$\{updated\.receiptNumber \|\| updated\.id\}\`/g,
`description: updated.description ? updated.description + \` - برداشت از \${resourceName}\` : \`پرداخت وجه به مبلغ \${formattedAmount} از \${resourceName} بابت رسید شماره \${updated.receiptNumber || updated.id}\``
);

fs.writeFileSync('src/services/invoiceService.ts', code);
