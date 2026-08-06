const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Add imports
const importsToAdd = `
import LoansDashboard from './LoansDashboard';
import LoansArrears from './LoansArrears';
import LoansReports from './LoansReports';
`;
code = code.replace(/import \{ formatDateDisplay \} from '\.\.\/\.\.\/utils\/format';/, "import { formatDateDisplay } from '../../utils/format';\n" + importsToAdd.trim());

// Modify state
code = code.replace(
/const \[activeTab, setActiveTab\] = useState<'list' \| 'create'>\('list'\);/,
`const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'arrears' | 'reports'>('dashboard');`
);

// Add tab buttons
const listTabButtonStr = `<button\n            onClick={() => setActiveTab('list')}`;
const extraTabsStr = `
          <button
            onClick={() => setActiveTab('dashboard')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'dashboard' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            داشبورد
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'list' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            فهرست وام‌ها
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'create' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            ثبت وام جدید
          </button>
          <button
            onClick={() => setActiveTab('arrears')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'arrears' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            معوقات
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'reports' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            گزارشات
          </button>
`;

code = code.replace(/<button\s+onClick=\{\(\) => setActiveTab\('list'\)\}[\s\S]*?ثبت وام جدید\s+<\/button>/, extraTabsStr.trim());

// Render new tabs
const listRenderStart = `{activeTab === 'list' && (`;
const extraRenderStr = `
        {activeTab === 'dashboard' && (
           <LoansDashboard loans={loans} installments={installments} persons={persons} />
        )}
        
        {activeTab === 'arrears' && (
           <LoansArrears loans={loans} installments={installments} persons={persons} />
        )}

        {activeTab === 'reports' && (
           <LoansReports loans={loans} installments={installments} persons={persons} />
        )}

        {activeTab === 'list' && (
`;

code = code.replace(listRenderStart, extraRenderStr.trim());

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
