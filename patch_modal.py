import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if 'import MinimalMobileReceiptModal' not in content:
    content = content.replace(
        'import MobileRestrictedMenu from "./components/MobileRestrictedMenu";',
        'import MobileRestrictedMenu from "./components/MobileRestrictedMenu";\nimport MinimalMobileReceiptModal from "./components/modals/MinimalMobileReceiptModal";'
    )

modal_jsx = """
      <MinimalMobileReceiptModal 
        isOpen={isReceiveModalOpen || isPayModalOpen}
        onClose={() => {
          setIsReceiveModalOpen(false);
          setIsPayModalOpen(false);
        }}
        type={isReceiveModalOpen ? 'receive' : 'pay'}
        persons={persons}
        receiptPersonId={receiptPersonId}
        setReceiptPersonId={setReceiptPersonId}
        receiptAmount={receiptAmount}
        setReceiptAmount={setReceiptAmount}
        receiptNote={receiptNote}
        setReceiptNote={setReceiptNote}
        receiptMethod={receiptMethod}
        setReceiptMethod={setReceiptMethod}
        handleSubmitReceipt={handleSubmitReceipt}
        formatNumber={formatNumber}
        submittingReceipt={submittingReceipt}
      />
"""

if '<MinimalMobileReceiptModal' not in content:
    content = content.replace(
        '<MobileRestrictedMenu activeTab={activeTab}',
        modal_jsx + '\n      <MobileRestrictedMenu activeTab={activeTab}'
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)
