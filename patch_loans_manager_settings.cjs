const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Add import
code = code.replace(
/import LoansReports from '\.\/LoansReports';/,
"import LoansReports from './LoansReports';\nimport LoansSettings from './LoansSettings';"
);

// Add tab to union type
code = code.replace(
/useState<'dashboard' \| 'list' \| 'create' \| 'arrears' \| 'reports'>/,
"useState<'dashboard' | 'list' | 'create' | 'arrears' | 'reports' | 'settings'>"
);

// Add tab button
const tabButtons = `<button
            onClick={() => setActiveTab('settings')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'settings' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            تنظیمات
          </button>
        </div>`;

code = code.replace(/<\/button>\s*<\/div>/, tabButtons);

// Render Settings
const renderSettings = `{activeTab === 'settings' && (
           <LoansSettings showNotification={showNotification} userRole={userRole} />
        )}

        {activeTab === 'list' && (`;

code = code.replace(/\{activeTab === 'list' && \(/, renderSettings);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
