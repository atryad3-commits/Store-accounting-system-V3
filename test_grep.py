with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find('printingTransaction && (')
if start != -1:
    end = content.find('})()}', start)
    print(content[start:end+5])
