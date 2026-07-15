const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const oldDragOver = `  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveColumn = COLUMNS.some(c => c.id === activeId);
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    if (!isActiveColumn && isOverColumn) {
      setItems((prev) => {
        const activeItems = prev.map(item => 
          item.id === activeId ? { ...item, status: overId } : item
        );
        return activeItems;
      });
    }
  };`;

const newDragOver = `  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeContainer = items.find(i => i.id === activeId)?.status;
    const overContainer = COLUMNS.some(c => c.id === overId) ? overId : items.find(i => i.id === overId)?.status;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev.filter((item) => item.id !== activeId);
      const activeItem = prev.find((item) => item.id === activeId);
      if (!activeItem) return prev;
      
      let newIndex = prev.findIndex((item) => item.id === overId);
      if (COLUMNS.some(c => c.id === overId)) {
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
  };`;

const oldDragEnd = `  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    let newItems = [...items];
    if (isOverColumn) {
      newItems = newItems.map(item => 
        item.id === activeId ? { ...item, status: overId } : item
      );
    } else {
      const oldIndex = newItems.findIndex(item => item.id === activeId);
      const newIndex = newItems.findIndex(item => item.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        newItems[oldIndex].status = newItems[newIndex].status;
        newItems = arrayMove(newItems, oldIndex, newIndex);
      }
    }
    setItems(newItems);
    await saveDebtorsTrackings(newItems);
  };`;

const newDragEnd = `  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const activeContainer = items.find(i => i.id === activeId)?.status;
    const overContainer = COLUMNS.some(c => c.id === overId) ? overId : items.find(i => i.id === overId)?.status;

    let newItems = [...items];
    
    if (activeContainer && overContainer && activeContainer === overContainer) {
      const oldIndex = newItems.findIndex(item => item.id === activeId);
      const newIndex = newItems.findIndex(item => item.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        newItems = arrayMove(newItems, oldIndex, newIndex);
      }
    } else if (activeContainer && overContainer) {
      const oldIndex = newItems.findIndex(item => item.id === activeId);
      if (oldIndex !== -1) {
         newItems[oldIndex].status = overContainer;
      }
    }

    setItems(newItems);
    await saveDebtorsTrackings(newItems);
  };`;

if (code.includes(oldDragOver)) {
    code = code.replace(oldDragOver, newDragOver);
}
if (code.includes(oldDragEnd)) {
    code = code.replace(oldDragEnd, newDragEnd);
}

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Fixed drag and drop logic');
