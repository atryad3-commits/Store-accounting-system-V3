import fs from 'fs';
let code = fs.readFileSync('src/components/admin/DatabaseDashboard.tsx', 'utf8');

const regex = /const handleBackup = async \(\) => \{\s+try \{\s+const res = await fetch\('\/api\/db\/backup'\);\s+if \(!res\.ok\) throw new Error\('Network response was not ok'\);\s+const blob = await res\.blob\(\);\s+const isSql = res\.headers\.get\('Content-Type'\)\?\.includes\('sql'\);\s+const extension = isSql \? 'sql' : 'json';\s+const a = document\.createElement\('a'\);\s+const url = window\.URL\.createObjectURL\('blob'\);\s+a\.href = url;\s+a\.download = `حسابداری-پشتیبان-\$\{new Date\(\)\.toLocaleDateString\('fa-IR'\)\.replace\(\/\\\/\\/g, '-'\)\}\.\$\{extension\}`;\s+document\.body\.appendChild\('a'\);\s+a\.click\(\);\s+window\.URL\.revokeObjectURL\(url\);\s+document\.body\.removeChild\('a'\);\s+showNotification\('نسخه پشتیبان با موفقیت دانلود شد', 'success'\);\s+\} catch \(e\) \{\s+showNotification\('خطا در دانلود نسخه پشتیبان', 'error'\);\s+\}\s+\};/g;

// Let's just use string replace.
const oldCode = `  const handleBackup = async () => {
    try {
      const res = await fetch('/api/db/backup');
      if (!res.ok) throw new Error('Network response was not ok');
      const blob = await res.blob();
      const isSql = res.headers.get('Content-Type')?.includes('sql');
      const extension = isSql ? 'sql' : 'json';
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = \`حسابداری-پشتیبان-\${new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-')}.\${extension}\`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification('نسخه پشتیبان با موفقیت دانلود شد', 'success');
    } catch (e) {
      showNotification('خطا در دانلود نسخه پشتیبان', 'error');
    }
  };`;

const newCode = `  const handleBackup = async () => {
    try {
      window.open('/api/db/backup', '_blank');
      showNotification('درخواست دانلود فایل پشتیبان ارسال شد', 'success');
    } catch (e) {
      showNotification('خطا در درخواست دانلود نسخه پشتیبان', 'error');
    }
  };`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/admin/DatabaseDashboard.tsx', code);
