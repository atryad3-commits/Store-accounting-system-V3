import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove useState for modals
content = re.sub(r'  const \[isReceiveModalOpen, setIsReceiveModalOpen\] = useState\(false\);\n', '', content)
content = re.sub(r'  const \[isPayModalOpen, setIsPayModalOpen\] = useState\(false\);\n', '', content)

# 2. Update autosave effect
autosave_old = """  useEffect(() => {
    if (isReceiveModalOpen || isPayModalOpen) {"""
autosave_new = """  useEffect(() => {
    const isReceiptOpen = activeTab === "create_receive_receipt" || activeTab === "create_pay_receipt";
    if (isReceiptOpen) {"""
content = content.replace(autosave_old, autosave_new)

content = content.replace('const docType = isReceiveModalOpen ? "receive_receipt" : "pay_receipt";', 'const docType = activeTab === "create_receive_receipt" ? "receive_receipt" : "pay_receipt";')

# 3. Update auto-select effect
autoselect_old = """      if (!isEdit && addedPerson?.id) {
        if (isReceiveModalOpen || isPayModalOpen) {"""
autoselect_new = """      if (!isEdit && addedPerson?.id) {
        const isReceiptOpen = activeTab === "create_receive_receipt" || activeTab === "create_pay_receipt";
        if (isReceiptOpen) {"""
content = content.replace(autoselect_old, autoselect_new)

# 4. Remove MinimalMobileReceiptModal
modal_regex = r'<MinimalMobileReceiptModal\s+isOpen=\{isReceiveModalOpen \|\| isPayModalOpen\}[\s\S]*?/>'
content = re.sub(modal_regex, '', content)

# 5. Remove setIsReceiveModalOpen from other places
content = re.sub(r'setIsReceiveModalOpen=\{setIsReceiveModalOpen\}\s*', '', content)
content = re.sub(r'setIsPayModalOpen=\{setIsPayModalOpen\}\s*', '', content)

# 6. Any other remaining setIsReceiveModalOpen(false)
content = re.sub(r'setIsReceiveModalOpen\(false\);\s*', '', content)
content = re.sub(r'setIsPayModalOpen\(false\);\s*', '', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
