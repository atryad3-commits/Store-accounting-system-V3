with open('src/components/financial/CheckManagement.tsx', 'r') as f:
    content = f.read()

replacement = """<CheckbooksManager 
            showNotification={showNotification} 
            checkbooks={checkbooks} 
            setCheckbooks={setCheckbooks} 
            accounts={accounts} 
            setIssuedCheckbookFilter={filters.setIssuedCheckbookFilter} 
            setActiveSubTab={setActiveSubTab} 
            storeSettings={storeSettings} 
          />"""

content = content.replace("<CheckbooksManager showNotification={showNotification} />", replacement)

with open('src/components/financial/CheckManagement.tsx', 'w') as f:
    f.write(content)
