const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import BackgroundSync from './components/common/BackgroundSync';
import SyncStatusModal from './components/common/SyncStatusModal';
import { useSyncQueueLength } from './services/syncQueueService';
import { CloudOff } from 'lucide-react';
`;

// Insert after the first import block
code = code.replace(
  'import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from \'react-router-dom\';',
  'import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from \'react-router-dom\';' + importsToAdd
);

// We need to find the main App component and add the hook and modals
const mainAppMatch = `function AppContent() {`;
const mainAppReplacement = `function AppContent() {
  const syncQueueLength = useSyncQueueLength();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
`;
code = code.replace(mainAppMatch, mainAppReplacement);

// Find calculator button in header and insert sync button before it
const calcButtonMatch = `<button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="p-2 border rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-slate-200"
                        title="ماشین حساب"
                      >`;

const syncButtonReplacement = `
                      <button
                        onClick={() => setIsSyncModalOpen(true)}
                        className="relative p-2 border rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-slate-200"
                        title="وضعیت همگام‌سازی"
                      >
                        <CloudOff className="w-5 h-5" />
                        {syncQueueLength > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-sm shadow-rose-500/40">
                            {syncQueueLength}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="p-2 border rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-slate-200"
                        title="ماشین حساب"
                      >`;
code = code.replace(calcButtonMatch, syncButtonReplacement);

// Add modal and background sync at the end of the root layout, right before CalculatorModal
const calcModalMatch = `<CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />`;
const modalReplacement = `<CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
        <SyncStatusModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />
        <BackgroundSync />`;
code = code.replace(calcModalMatch, modalReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
