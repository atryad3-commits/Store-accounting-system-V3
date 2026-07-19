import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

target_headers = """                                    <th className="py-4 px-6 text-right">
                                      عنوان کالا / خدمات
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      کد / بارکد
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                      موجودی
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      قیمت خرید
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      قیمت فروش
                                    </th>
                                    <th className="py-4 px-6 text-center w-28">
                                      وضعیت
                                    </th>
                                    <th className="py-4 px-6 text-center w-28">
                                      عملیات
                                    </th>"""

replacement_headers = """                                    <th className="py-4 px-6 text-right">
                                      عنوان کالا / خدمات
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      گروه کالا
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                      نوع کالا
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      کد / بارکد
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                      موجودی
                                    </th>
                                    <th className="py-4 px-6 text-right">
                                      قیمت فروش
                                    </th>
                                    <th className="py-4 px-6 text-center w-28">
                                      عملیات
                                    </th>"""

if target_headers in content:
    content = content.replace(target_headers, replacement_headers)
    print("Headers successfully patched.")
else:
    print("Headers target not found.")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
