with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

# Destruct removal
content = content.replace("setProductFormTab,", "")

# onClick clean up
old_click = """                        <button
                          onClick={() => {
                            setEditingProductId(null);
                            setNewProductName("");
                            setNewProductPrice("");
                            setNewProductType("product");
                            setNewProductCategoryId("");
                            setNewProductCode("");
                            setNewProductBarcode("");
                            setNewProductPurchasePrice("");
                            setNewProductStock("");
                            setNewProductMinStock("");
                            setNewProductUnit("");
                            setNewProductSecondaryUnit("");
                            setNewProductUnitRatio("");
                            setNewProductDesc("");
                            setProductFormTab("general");
                            setIsProductModalOpen(true);
                          }}"""

new_click = """                        <button
                          onClick={() => {
                            setEditingProductId(null);
                            setIsProductModalOpen(true);
                          }}"""

content = content.replace(old_click, new_click)

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
