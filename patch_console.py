import re

file = 'src/main.tsx'
with open(file, 'r') as f:
    content = f.read()

patch = """
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Encountered two children with the same key')) {
    console.log("REACT KEY ERROR CAUGHT:", args);
  }
  originalConsoleError(...args);
};
"""

if "originalConsoleError" not in content:
    content = content.replace("import App from './App.tsx'", "import App from './App.tsx'\n" + patch)
    with open(file, 'w') as f:
        f.write(content)
