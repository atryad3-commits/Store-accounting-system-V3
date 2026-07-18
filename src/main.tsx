window.addEventListener("error", (e) => { fetch("/api/data/system_logs/append", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ action: "FRONTEND_ERROR", entityType: "error", entityId: "1", oldData: e.message, newData: e.error?.stack }) }); });
import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx'

const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Encountered two children with the same key')) {
    console.log("REACT KEY ERROR CAUGHT:", args);
  }
  originalConsoleError(...args);
};
;
import 'vazirmatn/Vazirmatn-font-face.css';
import '@fontsource/jetbrains-mono';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import InitialSetupWizard from './components/InitialSetupWizard';

// Add global form validation message localization
document.addEventListener('invalid', (e) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  if (target && target.validity) {
    if (target.validity.valueMissing) {
      target.setCustomValidity('لطفا این قسمت را پر کنید.');
    } else if (target.validity.typeMismatch) {
      target.setCustomValidity('لطفا یک مقدار معتبر وارد کنید.');
    } else if (target.validity.rangeUnderflow) {
      const min = target.getAttribute('min');
      target.setCustomValidity(min ? `مقدار باید بزرگتر یا مساوی ${min} باشد.` : 'مقدار وارد شده کمتر از حد مجاز است.');
    } else if (target.validity.stepMismatch) {
      target.setCustomValidity('لطفا یک مقدار معتبر وارد کنید.');
    } else {
      target.setCustomValidity('مقدار وارد شده نامعتبر است.');
    }
  }
}, true);

document.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  if (target && target.setCustomValidity) {
    target.setCustomValidity('');
  }
}, true);

document.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  if (target && target.setCustomValidity) {
    target.setCustomValidity('');
  }
}, true);

const Root = () => {
  const [setupComplete, setSetupComplete] = useState(false);

  return (
    <>
      {!setupComplete ? (
        <InitialSetupWizard onComplete={() => setSetupComplete(true)} />
      ) : (
        <AuthProvider>
          <App />
        </AuthProvider>
      )}
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);


