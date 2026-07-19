import sys
import glob

# Add storeSettings: any to interface and props in all modals
modals = glob.glob('src/components/modals/*FormModal.tsx')

for modal in modals:
    with open(modal, 'r') as f:
        content = f.read()
    
    # Add to interface
    if 'storeSettings?: any;' not in content:
        content = content.replace('onSuccess:', 'storeSettings?: any;\n  onSuccess:')
    
    # Add to props destructuring
    if 'storeSettings,' not in content:
        content = content.replace('onSuccess,', 'storeSettings,\n  onSuccess,')
    
    # Also fix personModalActiveTab -> personFormTab
    if 'personModalActiveTab' in content:
        content = content.replace('personModalActiveTab', 'personFormTab')
        
    with open(modal, 'w') as f:
        f.write(content)
print("Fixed props")
