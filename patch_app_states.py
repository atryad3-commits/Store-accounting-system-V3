import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

# Replace block from `const [newProductName` to `const [submittingProduct`
start_idx = app_content.find('const [newProductName, setNewProductName] = useState("");')
if start_idx != -1:
    end_idx = app_content.find('const [submittingProduct, setSubmittingProduct] = useState(false);', start_idx) + 67
    app_content = app_content[:start_idx] + app_content[end_idx:]

# Person states
start_idx = app_content.find('const [newPersonName, setNewPersonName] = useState("");')
if start_idx != -1:
    end_idx = app_content.find('const [submittingPerson, setSubmittingPerson] = useState(false);', start_idx) + 65
    app_content = app_content[:start_idx] + app_content[end_idx:]

# Account states
start_idx = app_content.find('const [newAccountBankName, setNewAccountBankName] = useState("");')
if start_idx != -1:
    end_idx = app_content.find('const [submittingAccount, setSubmittingAccount] = useState(false);', start_idx) + 67
    app_content = app_content[:start_idx] + app_content[end_idx:]

# Cashbox states
start_idx = app_content.find('const [newCashboxName, setNewCashboxName] = useState("");')
if start_idx != -1:
    end_idx = app_content.find('const [submittingCashbox, setSubmittingCashbox] = useState(false);', start_idx) + 67
    app_content = app_content[:start_idx] + app_content[end_idx:]

# Warehouse states
start_idx = app_content.find('const [newWarehouseName, setNewWarehouseName] = useState("");')
if start_idx != -1:
    end_idx = app_content.find('const [submittingWarehouse, setSubmittingWarehouse] = useState(false);', start_idx) + 71
    app_content = app_content[:start_idx] + app_content[end_idx:]

# Now remove the old handlers
def remove_func(func_name):
    global app_content
    start_idx = app_content.find(f'const {func_name} = async')
    if start_idx == -1: return
    # it's usually followed by another function
    end_idx = app_content.find('const handle', start_idx + 10)
    if end_idx != -1:
        app_content = app_content[:start_idx] + app_content[end_idx:]

remove_func('handleSubmitProduct')
remove_func('handleSubmitPerson')
remove_func('handleSubmitAccount')
remove_func('handleSubmitCashbox')
remove_func('handleSubmitWarehouse')

with open('src/App.tsx', 'w') as f:
    f.write(app_content)
print("Removed old states and handlers from App.tsx")
