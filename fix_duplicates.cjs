const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the line that might have duplicates.
// The first line is probably: import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
// Let's remove the second one or any duplicates.

content = content.replace(/import \{ useLocation, useNavigate, Routes, Route \} from 'react-router-dom';\n/g, '');

fs.writeFileSync('src/App.tsx', content);
console.log("Removed duplicate imports");
