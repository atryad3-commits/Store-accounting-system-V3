const fs = require('fs');
let bmCode = fs.readFileSync('src/components/admin/BusinessManager.tsx', 'utf8');

// Fix signature
bmCode = bmCode.replace(/export default function BusinessManager\(\{ availableStores, setAvailableStores, onSelectStore \}: any\) \{/, 'export default function BusinessManager({ availableStores, setAvailableStores, onSelectStore, confirmAction, showNotification }: any) {');

// Fix handleSelectStore
bmCode = bmCode.replace(/const handleSelectStore = async \(id: string, name: string\) => \{[\s\S]*?try \{/m, 
`const handleSelectStore = async (id: string, name: string) => {
    confirmAction(\`آیا از ورود به کسب و کار «\${name}» اطمینان دارید؟\`, async () => {
      setLoading(id);
      setErrorMsg(null);
      try {`);
      
// Now we need to close the confirmAction properly. Wait, the original had:
// if (data.success) { onSelectStore(id); } else { throw new Error(data.message) }
// } catch(err:any) { setErrorMsg... } finally { setLoading(false); }
bmCode = bmCode.replace(/} finally \{\s*setLoading\(false\);\s*\}\s*\};/m, 
`} finally {
        setLoading(false);
      }
    });
  };`);

fs.writeFileSync('src/components/admin/BusinessManager.tsx', bmCode);
