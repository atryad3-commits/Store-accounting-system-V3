const fs = require('fs');
const content = fs.readFileSync('src/components/warehouses/WarehouseDocCreate.tsx', 'utf8');

const target = `                    <button
                      onClick={handleAddItem,
    handleVoidInvoice}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-xl font-bold hover:bg-gray-100 flex items-center gap-2 transition-colors whitespace-nowrap"
                    >`;

const replacement = `                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-xl font-bold hover:bg-gray-100 flex items-center gap-2 transition-colors whitespace-nowrap"
                    >`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/warehouses/WarehouseDocCreate.tsx', content.replace(target, replacement));
  console.log('Patched WarehouseDocCreate successfully');
} else {
  console.log('Target for WarehouseDocCreate not found');
}
