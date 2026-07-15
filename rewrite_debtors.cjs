const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const hookStart = "export default function DebtorsTracking({ persons, showNotification, storeSettings, confirmAction }: any) {";
const newState = `export default function DebtorsTracking({ persons, showNotification, storeSettings, confirmAction }: any) {
  const [columns, setColumns] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [activeId, setActiveId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [addMode, setAddMode] = useState<'single' | 'group'>('single');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedGroupRole, setSelectedGroupRole] = useState('all');
  
  const [newNote, setNewNote] = useState('');
  const [newNextDate, setNewNextDate] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dataItems = await getDebtorsTrackings();
      setItems(dataItems || []);
      const cols = await getCrmColumns();
      setColumns(cols || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveColumns = async (newCols: any[]) => {
    setColumns(newCols);
    await saveCrmColumns(newCols);
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newCol = {
      id: 'col_' + Date.now(),
      title: newColumnTitle.trim(),
      color: 'bg-gray-50',
      borderColor: 'border-gray-200',
      titleColor: 'text-gray-700'
    };
    handleSaveColumns([...columns, newCol]);
    setNewColumnTitle('');
  };

  const handleDeleteColumn = (id: string) => {
    if (items.some(item => item.status === id)) {
      showNotification('ابتدا موارد داخل این ستون را جابجا کنید', 'error');
      return;
    }
    confirmAction('آیا از حذف این ستون مطمئن هستید؟', () => {
      handleSaveColumns(columns.filter(c => c.id !== id));
    });
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeContainer = items.find(i => i.id === activeId)?.status;
    const overContainer = columns.some(c => c.id === overId) ? overId : items.find(i => i.id === overId)?.status;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev.filter((item) => item.id !== activeId);
      const activeItem = prev.find((item) => item.id === activeId);
      if (!activeItem) return prev;
      
      let newIndex = prev.findIndex((item) => item.id === overId);
      if (columns.some(c => c.id === overId)) {
        newIndex = activeItems.length;
      }
      if (newIndex < 0) newIndex = activeItems.length;
      
      const newItems = [
        ...activeItems.slice(0, newIndex),
        { ...activeItem, status: overContainer },
        ...activeItems.slice(newIndex)
      ];
      return newItems;
    });
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeContainer = items.find(i => i.id === activeId)?.status;
    const overContainer = columns.some(c => c.id === overId) ? overId : items.find(i => i.id === overId)?.status;

    let newItems = [...items];
    
    if (activeContainer && overContainer && activeContainer === overContainer) {
      const oldIndex = newItems.findIndex(item => item.id === activeId);
      const newIndex = newItems.findIndex(item => item.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        newItems = arrayMove(newItems, oldIndex, newIndex);
        setItems(newItems);
        await saveDebtorsTrackings(newItems);
      }
    } else if (activeContainer && overContainer && activeContainer !== overContainer) {
      const oldIndex = newItems.findIndex(item => item.id === activeId);
      if (oldIndex !== -1) {
         // Revert the optimistic update since we will ask for confirmation
         const targetStatusName = columns.find(c => c.id === overContainer)?.title || '';
         const personId = newItems[oldIndex].personId;
         const person = persons.find(p => String(p.id) === personId);
         
         if (confirmAction) {
           confirmAction(\`آیا از انتقال "\${person?.name || person?.companyName}" به وضعیت "\${targetStatusName}" مطمئن هستید؟\`, async () => {
              newItems[oldIndex].status = overContainer;
              
              // Also add a note about status change
              if (!newItems[oldIndex].notes) newItems[oldIndex].notes = [];
              newItems[oldIndex].notes.push({
                text: \`تغییر وضعیت به \${targetStatusName}\`,
                date: new Date().toISOString()
              });
              
              setItems(newItems);
              await saveDebtorsTrackings(newItems);
           });
         } else {
             newItems[oldIndex].status = overContainer;
             setItems(newItems);
             await saveDebtorsTrackings(newItems);
         }
      }
    }
  };`;

code = code.replace(/export default function DebtorsTracking\(\{ persons, showNotification, storeSettings, confirmAction \}: any\) \{([\s\S]*?)const handleAddSubmit =/g, newState + '\n\n  const handleAddSubmit =');

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Rewritten states and Dnd logic');
