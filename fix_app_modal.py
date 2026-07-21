import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_block = """
  if (appState.isStoreSelectionOpen) {
    return (
      <StoreSelectionModal 
        availableStores={appState.availableStores} 
        setAvailableStores={appState.setAvailableStores} 
        onSelectStore={(id: string) => {
          localStorage.setItem("activeStoreId", id);
          window.location.reload();
        }} 
      />
    );
  }

"""

content = content.replace("if (loading || authLoading) {", new_block + "if (loading || authLoading) {")

with open('src/App.tsx', 'w') as f:
    f.write(content)
