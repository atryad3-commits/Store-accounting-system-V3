import re

with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('  return (\n', '  const effectiveViewMode = isMobile ? "list" : personsViewMode;\n  return (\n')

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(content)
