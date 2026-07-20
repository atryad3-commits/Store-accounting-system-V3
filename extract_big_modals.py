import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# We only care about the end of the file after AnimatePresence mode="wait"
start_idx = text.find('</AnimatePresence>')

matches = re.finditer(r'\{([a-zA-Z0-9_]+)\s*&&\s*\(', text[start_idx:])
for m in matches:
    name = m.group(1)
    # find matching brace for the opening parenthesis
    paren_start = m.end() - 1
    brace_count = 1
    end_idx = paren_start + 1
    while brace_count > 0 and end_idx < len(text[start_idx:]):
        if text[start_idx:][end_idx] == '(':
            brace_count += 1
        elif text[start_idx:][end_idx] == ')':
            brace_count -= 1
        end_idx += 1
    
    block = text[start_idx:][paren_start:end_idx]
    print(f"Modal condition: {name}, lines: {block.count(chr(10))}")
