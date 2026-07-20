import re

with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

# Let's count how many {personFormTab === "general" && ( are there.
count = content.count('{personFormTab === "general" && (')
print("Count of general tabs:", count)

if count == 2:
    idx_first = content.find('{personFormTab === "general" && (')
    idx_second = content.find('{personFormTab === "general" && (', idx_first + 1)
    
    content = content[:idx_second] + '{personFormTab === "settings" && (' + content[idx_second + len('{personFormTab === "general" && ('):]

    with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
        f.write(content)
    print("Fixed the second general tab!")
else:
    print("Not exactly 2!")
