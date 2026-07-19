import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

target_row = """                                      <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5">
                                          <span className="font-extrabold text-gray-800">
                                            {p.name}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center ${p.type === "service" ? "bg-orange-50 text-orange-700 border border-orange-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}
                                            >
                                              {p.type === "service"
                                                ? "خدمات"
                                                : "کالا"}
                                            </span>
                                            {p.category && (
                                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                {p.category}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </td>"""

replacement_row = """                                      <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5">
                                          <span className="font-extrabold text-gray-800">
                                            {p.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-4 px-6">
                                        {p.category ? (
                                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                            {p.category}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 text-xs">---</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <span
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center ${p.type === "service" ? "bg-orange-50 text-orange-700 border border-orange-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}
                                        >
                                          {p.type === "service"
                                            ? "خدمات"
                                            : "کالا"}
                                        </span>
                                      </td>"""

if target_row in content:
    content = content.replace(target_row, replacement_row)
    print("Row 1 successfully patched.")
else:
    print("Row 1 target not found.")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
