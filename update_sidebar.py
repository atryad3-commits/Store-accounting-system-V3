import re

with open('src/utils/sidebarData.tsx', 'r') as f:
    content = f.read()

new_group = """
  {
    id: "personal_workspace",
    label: "فضای کاری شخصی",
    icon: <Activity className="w-5 h-5" />,
    items: [
      { id: "personal_notes", label: "یادداشت‌های شخصی", roles: ["admin", "accountant", "manager", "cashier"] },
    ],
  },
"""

content = content.replace("export const allSidebarGroups: SidebarGroup[] = [", "export const allSidebarGroups: SidebarGroup[] = [" + new_group)

with open('src/utils/sidebarData.tsx', 'w') as f:
    f.write(content)
