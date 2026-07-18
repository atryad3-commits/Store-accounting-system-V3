import re

with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'  setIsReceiveModalOpen\?: \(v: boolean\) => void;\n', '', content)
content = re.sub(r'  setIsPayModalOpen\?: \(v: boolean\) => void;\n', '', content)

content = re.sub(r'\s*setIsReceiveModalOpen,', '', content)
content = re.sub(r'\s*setIsPayModalOpen,', '', content)

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(content)
