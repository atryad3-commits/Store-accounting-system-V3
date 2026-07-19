import sys
import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

# 1. Imports
imports = """
import ProductFormModal from "./components/modals/ProductFormModal";
import PersonFormModal from "./components/modals/PersonFormModal";
import AccountFormModal from "./components/modals/AccountFormModal";
import CashboxFormModal from "./components/modals/CashboxFormModal";
import WarehouseFormModal from "./components/modals/WarehouseFormModal";
import SmsPanel from "./components/admin/SmsPanel";
"""

if "ProductFormModal" not in app_content:
    app_content = app_content.replace('import Select from "react-select";', imports + '\nimport Select from "react-select";')

# 2. Replace Modals in JSX
def replace_modal(start_str, end_str, replacement):
    global app_content
    start_idx = app_content.find(start_str)
    if start_idx == -1: return
    end_idx = app_content.find(end_str, start_idx)
    app_content = app_content[:start_idx] + replacement + app_content[end_idx:]

replace_modal('isProductModalOpen && (', 'isPersonExtraModalOpen && (', """
              <ProductFormModal 
                isOpen={isProductModalOpen} 
                onClose={() => setIsProductModalOpen(false)} 
                editingProductId={editingProductId} 
                products={products} 
                productCategories={productCategories} 
                warehouses={warehouses} 
                onSuccess={() => fetchDataSilent()} 
                showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                confirmAction={confirmAction} 
                activeTab={activeTab} 
                handleFastAddProduct={handleFastAddProduct} 
              />
              {""")

replace_modal('isPersonModalOpen && window.innerWidth >= 768 && (', 'isAccountModalOpen && (', """
              <PersonFormModal 
                isOpen={isPersonModalOpen && window.innerWidth >= 768} 
                onClose={() => setIsPersonModalOpen(false)} 
                editingPersonId={editingPersonId} 
                persons={persons} 
                personGroups={personGroups} 
                personRoles={personRoles} 
                onSuccess={() => fetchDataSilent()} 
                showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                confirmAction={confirmAction} 
              />
              {""")

replace_modal('isAccountModalOpen && (', 'isCashboxModalOpen && (', """
              <AccountFormModal 
                isOpen={isAccountModalOpen} 
                onClose={() => setIsAccountModalOpen(false)} 
                editingAccountId={editingAccountId} 
                accounts={accounts} 
                onSuccess={() => fetchDataSilent()} 
                showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                confirmAction={confirmAction} 
              />
              {""")

replace_modal('isCashboxModalOpen && (', 'isWarehouseModalOpen && (', """
              <CashboxFormModal 
                isOpen={isCashboxModalOpen} 
                onClose={() => setIsCashboxModalOpen(false)} 
                editingCashboxId={editingCashboxId} 
                cashboxes={cashboxes} 
                onSuccess={() => fetchDataSilent()} 
                showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                confirmAction={confirmAction} 
              />
              {""")

replace_modal('isWarehouseModalOpen && (', '{isClear', """
              <WarehouseFormModal 
                isOpen={isWarehouseModalOpen} 
                onClose={() => setIsWarehouseModalOpen(false)} 
                editingWarehouseId={editingWarehouseId} 
                warehouses={warehouses} 
                onSuccess={() => fetchDataSilent()} 
                showNotification={(msg, type = "success") => setNotification({ message: msg, type })} 
                confirmAction={confirmAction} 
              />
              {""")

replace_modal(') : activeTab === "sms_panel" ? (', ') : activeTab === "system_logs" ? (', """
                ) : activeTab === "sms_panel" ? (
                  <SmsPanel storeSettings={storeSettings} setActiveTab={setActiveTab} setSettingsTab={setSettingsTab} />
                """)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

print("Replaced modals in App.tsx")
