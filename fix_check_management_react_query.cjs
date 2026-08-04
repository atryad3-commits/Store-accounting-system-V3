const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(/import { useState, useEffect } from 'react';/, "import { useState, useEffect } from 'react';\nimport { useQuery } from '@tanstack/react-query';\nimport { getChecksSummary } from '../../services/dataService';");

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
