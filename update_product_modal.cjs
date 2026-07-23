const fs = require('fs');
let content = fs.readFileSync('src/components/products/FastProductCreateModal.tsx', 'utf8');

content = content.replace(
  `const [stock, setStock] = useState("");`,
  `const [stock, setStock] = useState("");\n  const [imageUrl, setImageUrl] = useState("");`
);

content = content.replace(
  `name: name.trim(),`,
  `name: name.trim(),\n        imageUrl: imageUrl.trim(),`
);

content = content.replace(
  `setStock("");`,
  `setStock("");\n            setImageUrl("");`
);

const inputField = `
                    {/* Image URL */}
                    <div className="md:col-span-2 relative group">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        placeholder="آدرس تصویر کالا (اختیاری)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full pl-3 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-sm outline-none"
                      />
                    </div>
`;

content = content.replace(
  `{/* Stock & Prices */}`,
  inputField + `\n                    {/* Stock & Prices */}`
);

fs.writeFileSync('src/components/products/FastProductCreateModal.tsx', content);
console.log("Updated FastProductCreateModal with imageUrl");
