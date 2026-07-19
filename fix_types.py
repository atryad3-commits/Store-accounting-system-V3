import re

with open('src/types.ts', 'r') as f:
    content = f.read()

history_type = """
export interface NoteHistory {
  date: string;
  action: string;
  details?: string;
}

export interface PersonalNote {
"""

content = content.replace("export interface PersonalNote {", history_type)

new_fields = """
  linkedPersons?: string[];
  linkedDocs?: string[];
  images?: string[];
  reminderDate?: string;
  history?: NoteHistory[];
"""

content = re.sub(r'(export interface PersonalNote \{.*?)(\n\})', r'\1' + new_fields + r'\2', content, flags=re.DOTALL)

with open('src/types.ts', 'w') as f:
    f.write(content)
