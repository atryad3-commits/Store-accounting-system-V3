import re

file = 'src/App.tsx'
with open(file, 'r') as f:
    content = f.read()

pattern = r'\s*// Mobile routing restriction\s*useEffect\(\(\) => \{\s*const checkMobileRoute = \(\) => \{.*?\}, \[activeTab\]\);'

content = re.sub(pattern, '', content, flags=re.DOTALL)

with open(file, 'w') as f:
    f.write(content)
