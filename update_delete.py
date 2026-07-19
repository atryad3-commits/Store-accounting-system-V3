import re

with open('src/services/dataService.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"export const deletePersonalNote = async \(id: string\): Promise<any> => \{.*?\n\};\n?",
    r"""export const deletePersonalNote = async (id: string): Promise<any> => {
  const notes = await getPersonalNotes();
  const filtered = notes.filter((n: any) => String(n.id) !== String(id));
  return savePersonalNotes(filtered);
};
""",
    content,
    flags=re.DOTALL
)

with open('src/services/dataService.ts', 'w') as f:
    f.write(content)
