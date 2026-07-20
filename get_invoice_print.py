with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find('previewInvoiceData && (')
if start != -1:
    end = content.find('})()}', start)
    print("Found previewInvoiceData print block")

start2 = content.find('viewingInvoice && (')
if start2 != -1:
    end2 = content.find('})()}', start2)
    print("Found viewingInvoice print block")
