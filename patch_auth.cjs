const fs = require('fs');
let content = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

if (!content.includes('import WelcomePage')) {
  content = content.replace('import SystemChecklist from', 'import WelcomePage from "../components/WelcomePage";\nimport SystemChecklist from');
}

if (!content.includes('const [showLogin, setShowLogin]')) {
  content = content.replace(
    'const [user, setUser] = useState<User | null>(null);',
    'const [user, setUser] = useState<User | null>(null);\n  const [showLogin, setShowLogin] = useState(false);'
  );
}

const returnReplacement = `
    if (!showLogin) {
      return <WelcomePage onLoginClick={() => setShowLogin(true)} />;
    }

    return (
`;

content = content.replace('    return (\n      <div className="min-h-screen flex w-full bg-slate-50 font-sans" dir="rtl">', returnReplacement + '      <div className="min-h-screen flex w-full bg-slate-50 font-sans" dir="rtl">');

fs.writeFileSync('src/context/AuthContext.tsx', content);
