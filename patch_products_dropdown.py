import sys

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

target_state = "const { \n    Package, Plus, Search, Filter, ArrowUpDown, MoreVertical, Edit, Trash2, \n    X, Check, AlertCircle, ChevronDown, ChevronUp, Download, Upload, \n    Copy, Barcode, Eye, FileText, Image\n  } = lucide;"

replacement_state = """const { 
    Package, Plus, Search, Filter, ArrowUpDown, MoreVertical, Edit, Trash2, 
    X, Check, AlertCircle, ChevronDown, ChevronUp, Download, Upload, 
    Copy, Barcode, Eye, FileText, Image
  } = lucide;

  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId !== null) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownId]);"""

if target_state in content:
    content = content.replace(target_state, replacement_state)
    print("State added.")
else:
    print("State target not found.")

target_markup = """                                        <div className="relative inline-block text-left group">
                                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-center w-8 h-8">
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div className="absolute left-4 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">"""

replacement_markup = """                                        <div className="relative inline-block text-left">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenDropdownId(openDropdownId === p.id ? null : p.id);
                                            }}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center justify-center w-8 h-8"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div className={`absolute left-4 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all z-50 ${openDropdownId === p.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>"""

if target_markup in content:
    content = content.replace(target_markup, replacement_markup)
    print("Markup patched.")
else:
    print("Markup target not found.")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
