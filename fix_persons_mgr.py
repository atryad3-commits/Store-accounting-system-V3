with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    c = f.read()

c = c.replace('                const effectiveViewMode = isMobile ? "list" : personsViewMode;\n  return (', '                                  return (')
c = c.replace('              const effectiveViewMode = isMobile ? "list" : personsViewMode;\n  return (', '                                return (')

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(c)
