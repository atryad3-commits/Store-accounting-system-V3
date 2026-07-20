with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find('viewingInvoice && (')
if start != -1:
    print("Found viewingInvoice!")
    # see what it prints
    print(content[start:start+500])
