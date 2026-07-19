import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

target = """                                      <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5">
                                          <span className="font-extrabold text-gray-800">
                                            {p.name}
                                          </span>
                                        </div>
                                      </td>"""

replacement = """                                      <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5 items-start">
                                          <button
                                            onClick={() => {
                                              setViewingProduct(p);
                                              setActiveTab("product_view");
                                            }}
                                            className="font-extrabold text-indigo-700 hover:text-indigo-900 text-right transition-colors hover:underline text-sm"
                                          >
                                            {p.name}
                                          </button>
                                        </div>
                                      </td>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced product name cell in ProductsTab.tsx")
else:
    print("Target not found in ProductsTab.tsx")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)

