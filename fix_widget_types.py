import re

with open('src/components/notes/DashboardPersonalNotesWidget.tsx', 'r') as f:
    content = f.read()

replacement = """
    const note: PersonalNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: newContent,
      color: "default",
      isPinned: false,
      isArchived: false,
      tags: [],
      images: [],
      linkedPersons: [],
      linkedDocs: [],
      history: [{ date: new Date().toISOString(), action: 'ایجاد یادداشت از داشبورد' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
"""

content = re.sub(r'const note: PersonalNote = \{.*?updatedAt: new Date\(\)\.toISOString\(\)\s*\};', replacement.strip(), content, flags=re.DOTALL)

with open('src/components/notes/DashboardPersonalNotesWidget.tsx', 'w') as f:
    f.write(content)
