import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end of ProductsTab tag
start_tag = '<ProductsTab '
end_tag = '                      />\n                    ) : activeTab === "person_opening_balances" ? ('

start_idx = content.find(start_tag)
if start_idx != -1:
    end_idx = content.find(end_tag, start_idx)
    if end_idx != -1:
        replacement = '''<ProductsTab
                        {...appState}
                        formatCurrency={formatCurrency}
                        toPersianDigits={toPersianDigits}
                        numToPersianWords={numToPersianWords}
                        DatePicker={DatePicker}
                        persian={persian}
                        persian_fa={persian_fa}
                        AIProductSearchModal={AIProductSearchModal}
                      />
                    ) : activeTab === "person_opening_balances" ? ('''
        content = content[:start_idx] + replacement + content[end_idx + len(end_tag):]

        with open('src/App.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched ProductsTab in App.tsx successfully.")
    else:
        print("End tag not found")
else:
    print("Start tag not found")

