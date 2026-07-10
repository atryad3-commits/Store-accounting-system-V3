with open("src/components/modals/PricingWizardModal.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "updateProductSalePrice, setSuccessMsg, fetchProducts",
    "updateProductSalePrice, setSuccessMsg, fetchProducts, updateProduct, List"
)

with open("src/components/modals/PricingWizardModal.tsx", "w") as f:
    f.write(content)

with open("src/App.tsx", "r") as f:
    app = f.read()

app = app.replace(
    "updateProductSalePrice={updateProductSalePrice} setSuccessMsg={setSuccessMsg} fetchProducts={fetchProducts}",
    "updateProductSalePrice={updateProductSalePrice} setSuccessMsg={setSuccessMsg} fetchProducts={fetchProducts} updateProduct={updateProduct} List={List}"
)

with open("src/App.tsx", "w") as f:
    f.write(app)
