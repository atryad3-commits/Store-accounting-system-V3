import re
with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

bad_props = [
    'setNewProductSecondaryUnit=', 'setNewProductUnitRatio=', 'setNewProductDesc=', 'setProductFormTab=', 
    'setNewProductName=', 'setNewProductPrice=', 'setNewProductType=', 'setNewProductCategoryId=', 
    'setNewProductCode=', 'setNewProductBarcode=', 'setNewProductPurchasePrice=', 'setNewProductStock=', 
    'setNewProductMinStock=', 'setNewProductUnit=', 'setNewProductIsActive=',
    'setNewAccountBankName=', 'setNewAccountBranchName=', 'setNewAccountNumber=', 'setNewAccountCardNumber=', 
    'setNewAccountShebaNumber=', 'setNewAccountBalance=', 'setNewAccountHolder=',
    'setNewCashboxName=', 'setNewCashboxManager=', 'newProductIsActive='
]

new_lines = []
for line in lines:
    keep = True
    for bp in bad_props:
        if bp in line:
            keep = False
            break
    if keep:
        new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
