const fs = require('fs');
let content = fs.readFileSync('src/components/SidebarNavigation.tsx', 'utf-8');

// Update props interface
content = content.replace(
  '  setExpandedGroups: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;\n}',
  `  setExpandedGroups: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;\n  setIsReceiveModalOpen?: (v: boolean) => void;\n  setIsPayModalOpen?: (v: boolean) => void;\n}`
);

// Add to destructuring
content = content.replace(
  '    setExpandedGroups,',
  '    setExpandedGroups,\n    setIsReceiveModalOpen,\n    setIsPayModalOpen,'
);

// Update setActiveTab calls in the menu
// In vertical menu:
content = content.replace(
  `                              onClick={() => {
                                setActiveTab(item.id as any);
                                setIsSidebarOpen(false);
                              }}`,
  `                              onClick={() => {
                                if (item.id === "create_receive_receipt") {
                                  setIsReceiveModalOpen?.(true);
                                } else if (item.id === "create_pay_receipt") {
                                  setIsPayModalOpen?.(true);
                                } else {
                                  setActiveTab(item.id as any);
                                }
                                setIsSidebarOpen(false);
                              }}`
);

// In horizontal menu:
content = content.replace(
  `                      onClick={() => setActiveTab(item.id as any)}`,
  `                      onClick={() => {
                        if (item.id === "create_receive_receipt") {
                          setIsReceiveModalOpen?.(true);
                        } else if (item.id === "create_pay_receipt") {
                          setIsPayModalOpen?.(true);
                        } else {
                          setActiveTab(item.id as any);
                        }
                      }}`
);

fs.writeFileSync('src/components/SidebarNavigation.tsx', content);
