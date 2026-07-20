with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

start = content.find('pricingPrintMode === "labels"')
if start != -1:
    end = content.find('</div>', start + 400)
    print(content[start:end+200])
