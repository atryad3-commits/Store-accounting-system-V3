const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const varsToAdd = `
  const syncQueueLength = useSyncQueueLength();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
`;

code = code.replace(
  'export default function App() {',
  'export default function App() {' + varsToAdd
);

fs.writeFileSync('src/App.tsx', code);
console.log('App vars patched');
