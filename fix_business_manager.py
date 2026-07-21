import sys
import re

with open('src/components/admin/BusinessManager.tsx', 'r') as f:
    content = f.read()

# Replace handleCreate body
handle_create = """  const [dbType, setDbType] = useState('sqlite');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');

  const handleCreate = async () => {
    if (!newStoreName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newStoreName,
          db_type: dbType,
          db_host: dbHost,
          db_port: dbPort,
          db_name: dbName,
          db_user: dbUser,
          db_password: dbPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores([...availableStores, data.database]);
        setNewStoreName('');
        setDbType('sqlite');
        setDbHost('');
        setDbPort('');
        setDbName('');
        setDbUser('');
        setDbPassword('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };"""

content = re.sub(r'const handleCreate = async \(\) => \{.*?\n  \};', handle_create, content, flags=re.DOTALL)

with open('src/components/admin/BusinessManager.tsx', 'w') as f:
    f.write(content)
