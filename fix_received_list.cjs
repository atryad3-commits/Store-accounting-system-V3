const fs = require('fs');
let file = fs.readFileSync('src/components/financial/checks/ReceivedChecksList.tsx', 'utf8');

// Add new props
file = file.replace(
  /export function ReceivedChecksList\(\{ showNotification(.*?) \}\) \{/,
  "export function ReceivedChecksList({ showNotification$1, receivedPage, setReceivedPage, totalReceivedPages }) {"
);

// Add Pagination Controls at the bottom
file = file.replace(/        <\/div>\n        \) : activeSubTab === 'check_calendar' \? \(\n          \n    <\/>/, `        </div>

            {/* Pagination Controls */}
            {totalReceivedPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pb-6">
                <button 
                  onClick={() => setReceivedPage(p => Math.max(1, p - 1))}
                  disabled={receivedPage === 1}
                  className="px-4 py-2 border rounded-xl text-sm font-bold bg-white text-gray-700 disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="text-sm font-bold text-gray-700">صفحه {receivedPage} از {totalReceivedPages}</span>
                <button 
                  onClick={() => setReceivedPage(p => Math.min(totalReceivedPages, p + 1))}
                  disabled={receivedPage === totalReceivedPages}
                  className="px-4 py-2 border rounded-xl text-sm font-bold bg-white text-gray-700 disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}
        </div>
    </>`);

fs.writeFileSync('src/components/financial/checks/ReceivedChecksList.tsx', file);
