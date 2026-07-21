import sys

with open('src/hooks/useAppController.tsx', 'r') as f:
    content = f.read()

# Replace all occurrences of the mistakenly inserted text back to "return {"
bad_text = "return {\n    productSearchTerm,\n    setProductSearchTerm,\n"
content = content.replace(bad_text, "return {\n")

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.write(content)
