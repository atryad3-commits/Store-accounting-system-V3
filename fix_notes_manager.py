import re

with open('src/components/notes/PersonalNotesManager.tsx', 'r') as f:
    content = f.read()

print("File loaded, length:", len(content))
