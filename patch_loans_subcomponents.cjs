const fs = require('fs');
const files = ['LoansDashboard.tsx', 'LoansArrears.tsx', 'LoansReports.tsx'];

files.forEach(file => {
    let code = fs.readFileSync('src/components/loans/' + file, 'utf8');
    
    // Add formatCurrency?: (val: number) => string; to Props
    code = code.replace(
        /interface\s+\w+Props\s*\{/,
        `$&
  formatCurrency?: (val: number) => string;`
    );

    // Destructure formatCurrency
    code = code.replace(
        /(export\s+default\s+function\s+\w+\(\s*\{\s*)([\s\S]*?)(\}\s*:\s*\w+Props\s*\)\s*\{)/,
        function(match, p1, p2, p3) {
            return p1 + '\n  formatCurrency = (val: number) => Number(val).toLocaleString("fa-IR") + " تومان",\n  ' + p2.trim() + '\n' + p3;
        }
    );

    // Replace {addCommas(X)} تومان -> {formatCurrency(X)}
    code = code.replace(/\{addCommas\(([^)]+)\)\}\s*(?:<[^>]+>)?تومان(?:<\/[^>]+>)?/g, "{formatCurrency($1)}");
    code = code.replace(/addCommas\(([^)]+)\)\s*\+\s*' تومان'/g, "formatCurrency($1)");
    code = code.replace(/addCommas\(([^)]+)\)\s*\+\s*" تومان"/g, "formatCurrency($1)");

    // Fix column headers that say (تومان) -> (واحد پول)
    code = code.replace(/\(تومان\)/g, "(واحد پول)");

    fs.writeFileSync('src/components/loans/' + file, code);
});
