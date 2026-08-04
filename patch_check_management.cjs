const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

// Add imports
file = file.replace(
  "import { IssuedChecksList } from './checks/IssuedChecksList';",
  "import { IssuedChecksList } from './checks/IssuedChecksList';\nimport { PendingCheckApprovals } from './checks/PendingCheckApprovals';\nimport { useAuth } from '../../context/AuthContext';\nimport { ShieldCheck } from 'lucide-react';"
);

// Add useAuth to CheckManagement component
file = file.replace(
  "export default function CheckManagement(",
  "export default function CheckManagement("
);
file = file.replace(
  /const notify = \(msg: string, type: 'success' \| 'error' \| 'info' \| 'warning' = 'info'\) => \{/,
  "const { user } = useAuth();\n  const notify = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {"
);

// Add 'pending_approvals' to subtabs
file = file.replace(
  /\{ id: 'check_calendar', label: 'تقویم سررسید', icon: <Calendar className="w-4 h-4" \/> \}/,
  "{ id: 'check_calendar', label: 'تقویم سررسید', icon: <Calendar className=\"w-4 h-4\" /> },\n            { id: 'pending_approvals', label: 'در انتظار تأیید', icon: <ShieldCheck className=\"w-4 h-4\" /> }"
);

// Add condition for 'pending_approvals' rendering
file = file.replace(
  /\{activeSubTab === 'check_calendar' && \(/,
  `{activeSubTab === 'pending_approvals' && (
          <PendingCheckApprovals
            issuedChecks={issuedChecks}
            receivedChecks={receivedChecks}
            persons={persons}
            accounts={accounts}
            checkbooks={checkbooks}
            showNotification={notify}
            userRole={user?.role}
            currentUserId={user?.id || user?.username}
            onCheckUpdated={() => {
              // Trigger a refetch if possible. Since we're using React Query, invalidating queries would be best.
              // For now, it will refetch automatically or we can trigger it.
            }}
          />
        )}
        {activeSubTab === 'check_calendar' && (`
);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
