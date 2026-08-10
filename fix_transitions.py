import sys
import re

file_path = 'src/components/loans/LoansManager.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const validTransitions: Record<string, string[]> = {
      requested: ['incomplete', 'completed_dossier'],
      incomplete: ['completed_dossier'],
      completed_dossier: ['incomplete', 'approved'],
      approved: ['active'],
      active: ['completed'],
      overdue: ['completed', 'active'],
      completed: [] // No coming back from completed
    };"""

replacement = """    const validTransitions: Record<string, string[]> = {
      requested: ['incomplete', 'completed_dossier'],
      incomplete: ['completed_dossier'],
      completed_dossier: ['incomplete', 'approved'],
      approved: ['active'],
      active: ['completed', 'overdue'],
      overdue: ['completed', 'active'],
      completed: [] // No coming back from completed
    };"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
