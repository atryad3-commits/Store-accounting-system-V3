const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const \[activeTab, setRawActiveTab\] = useState<[\s\S]*?>\("financial_report"\);/;
const match = code.match(regex);

if (match) {
    const replacement = match[0] + `

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setRawActiveTab(hash as any);
      }
    };
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('popstate', handlePopState);
    
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
       setRawActiveTab(initialHash as any);
    }
    
    return () => {
       window.removeEventListener('hashchange', handlePopState);
       window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  useEffect(() => {
    if (activeTab && window.location.hash !== \`#\${activeTab}\`) {
      window.history.pushState(null, '', \`#\${activeTab}\`);
    }
  }, [activeTab]);
`;
    code = code.replace(match[0], replacement);
    fs.writeFileSync('src/App.tsx', code, 'utf-8');
    console.log('Patched URL routing in App.tsx');
} else {
    console.log('Could not find activeTab definition');
}
