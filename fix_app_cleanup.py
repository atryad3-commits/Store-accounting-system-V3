import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const handleSystemUpdate = async \(\) => \{.*?\n  };\n', '', content, flags=re.DOTALL)
content = re.sub(r'  const \[updatingStr, setUpdatingStr\] = useState\(false\);\n', '', content)
content = re.sub(r'  const \[updateLog, setUpdateLog\] = useState\(""\);\n', '', content)
content = re.sub(r'  const \[updateProgress, setUpdateProgress\] = useState\(0\);\n', '', content)
content = re.sub(r'  const \[updateStepName, setUpdateStepName\] = useState\(""\);\n', '', content)
content = re.sub(r'  const \[updateStepsStatus, setUpdateStepsStatus\] = useState<\{[\s\S]*?\}>\(.*?\}\);\n', '', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

