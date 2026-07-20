with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

start = content.find('const [pricingPrintMode, setPricingPrintMode]')
if start != -1:
    end = content.find(';', start)
    print(content[start:end+1])
