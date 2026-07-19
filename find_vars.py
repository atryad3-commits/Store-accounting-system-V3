import re
import sys

def get_vars(filename, start_str, end_str):
    with open(filename, 'r') as f:
        content = f.read()
    
    start = content.find(start_str)
    end = content.find(end_str, start)
    if start == -1 or end == -1: return []
    
    chunk = content[start:end]
    
    # basic variable extraction
    words = set(re.findall(r'\b([a-zA-Z_][a-zA-Z0-9_]*)\b', chunk))
    return words

words = get_vars('src/App.tsx', 'isProductModalOpen && (', 'isPersonExtraModalOpen && (')
print("Found words:", len(words))
