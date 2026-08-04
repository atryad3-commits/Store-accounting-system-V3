const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/IssuedChecksList.tsx', 'utf8');

// Add new props
file = file.replace(
  /export function IssuedChecksList\(\{ showNotification(.*?) \}\) \{/,
  "export function IssuedChecksList({ showNotification$1, issuedPage, setIssuedPage, totalIssuedPages }) {"
);

// Add Pagination Controls
const paginationUI = `
            {/* Pagination Controls */}
            {totalIssuedPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pb-6">
                <button 
                  onClick={() => setIssuedPage(p => Math.max(1, p - 1))}
                  disabled={issuedPage === 1}
                  className="px-4 py-2 border rounded-xl text-sm font-bold bg-white text-gray-700 disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="text-sm font-bold text-gray-700">صفحه {issuedPage} از {totalIssuedPages}</span>
                <button 
                  onClick={() => setIssuedPage(p => Math.min(totalIssuedPages, p + 1))}
                  disabled={issuedPage === totalIssuedPages}
                  className="px-4 py-2 border rounded-xl text-sm font-bold bg-white text-gray-700 disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>
`;

file = file.replace(/          <\/div>\s*<CheckModals/g, paginationUI + "\n<CheckModals");
// Try simpler replace if that doesn't match:
if (!file.includes('Pagination Controls')) {
  file = file.replace(/          <\/div>\s*<\/>/g, paginationUI + "\n</>");
}

fs.writeFileSync('src/components/financial/checks/IssuedChecksList.tsx', file);
