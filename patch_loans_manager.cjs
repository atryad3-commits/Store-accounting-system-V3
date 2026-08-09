const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

// Add useNavigate
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { useNavigate } from 'react-router-dom';");

// Update props
content = content.replace("userRole?: string;\n}", "userRole?: string;\n  activeTab?: 'dashboard' | 'list' | 'create' | 'payment' | 'arrears' | 'reports' | 'settings';\n}");

// Replace useState
content = content.replace("  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'create' | 'payment' | 'arrears' | 'reports' | 'settings'>('dashboard');", "  const navigate = useNavigate();");

// Add activeTab to destructured props
content = content.replace("  currentUser = 'سیستم',\n  userRole = 'viewer'\n}: LoansManagerProps) {", "  currentUser = 'سیستم',\n  userRole = 'viewer',\n  activeTab = 'dashboard'\n}: LoansManagerProps) {");

// Replace setActiveTab calls
content = content.replace(/setActiveTab\('([^']+)'\)/g, "navigate('/loans_$1')");

// Remove the tab buttons block
const startTabs = content.indexOf('<div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">');
const endTabs = content.indexOf('</div>\n      </div>\n\n      {activeTab === \'create\'');
if (startTabs !== -1 && endTabs !== -1) {
    content = content.slice(0, startTabs) + content.slice(endTabs + 7);
}

fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
