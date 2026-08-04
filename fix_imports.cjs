const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

if (!file.includes("import { useQuery ")) {
  file = file.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { useQuery, useQueryClient } from '@tanstack/react-query';"
  );
  
  // also update onCheckUpdated
  file = file.replace(
    "onCheckUpdated={fetchData}",
    "onCheckUpdated={() => { fetchData(); queryClient.invalidateQueries({ queryKey: ['issued_checks'] }); queryClient.invalidateQueries({ queryKey: ['received_checks'] }); }}"
  );
  
  file = file.replace(
    /const \{ user \} = useAuth\(\);/,
    "const { user } = useAuth();\n  const queryClient = useQueryClient();"
  );
  
  fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
}
