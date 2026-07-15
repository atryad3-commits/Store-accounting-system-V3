const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

// We need to add useDroppable import and implement a DroppableColumn component
const importSortableContext = "import {\n  arrayMove,\n  SortableContext,\n  sortableKeyboardCoordinates,\n  verticalListSortingStrategy,\n  useSortable\n} from '@dnd-kit/sortable';";

code = code.replace(importSortableContext, "import {\n  arrayMove,\n  SortableContext,\n  sortableKeyboardCoordinates,\n  verticalListSortingStrategy,\n  useSortable\n} from '@dnd-kit/sortable';\nimport { useDroppable } from '@dnd-kit/core';");

const sortableItemCode = `function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}`;

const droppableColumnCode = `function DroppableColumn({ id, items, children, className }: any) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
}`;

if (!code.includes('function DroppableColumn')) {
    code = code.replace(sortableItemCode, sortableItemCode + '\\n\\n' + droppableColumnCode);
}

// In DebtorsTracking, replace the inner column rendering to use DroppableColumn
const oldColumnRender = `<div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]" id={column.id}>
                  <SortableContext items={columnItems.map(i => i.id)} strategy={verticalListSortingStrategy}>`;

const newColumnRender = `<DroppableColumn id={column.id} items={columnItems} className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[150px]">`;

const oldColumnRenderEnd = `</SortableContext>
                </div>`;
                
const newColumnRenderEnd = `</DroppableColumn>`;

if (code.includes(oldColumnRender)) {
    code = code.replace(oldColumnRender, newColumnRender);
    code = code.replace(oldColumnRenderEnd, newColumnRenderEnd);
}

// Ensure DebtorsTracking receives storeSettings for calendar
const oldExport = `export default function DebtorsTracking({ persons, showNotification }: any) {`;
const newExport = `import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export default function DebtorsTracking({ persons, showNotification, storeSettings }: any) {`;

if (!code.includes('import DatePicker from')) {
    code = code.replace(oldExport, newExport);
}

// Handle Note Date Input correctly with DatePicker
const oldDateInput = `<input 
                      type="date" 
                      value={newNextDate} 
                      onChange={e => setNewNextDate(e.target.value)} 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none font-sans"
                    />`;

const newDateInput = `<DatePicker
                      value={newNextDate ? new Date(newNextDate) : null}
                      onChange={(date: any) => {
                          if (date) {
                              const d = new Date(date.toDate());
                              const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                              setNewNextDate(localDate.toISOString().split('T')[0]);
                          } else {
                              setNewNextDate('');
                          }
                      }}
                      calendar={storeSettings?.calendarType === "gregorian" ? undefined : persian}
                      locale={storeSettings?.calendarType === "gregorian" ? undefined : persian_fa}
                      containerClassName="w-full"
                      inputClass="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none font-sans"
                    />`;

if (code.includes(oldDateInput)) {
    code = code.replace(oldDateInput, newDateInput);
}

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Fixed DebtorsTracking');
