import re

with open('src/components/reports/FinancialDashboard.tsx', 'r') as f:
    content = f.read()

# I need to add import for DashboardPersonalNotesWidget
if 'DashboardPersonalNotesWidget' not in content:
    content = content.replace('import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, CartesianGrid } from \'recharts\';', 
                              'import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, CartesianGrid } from \'recharts\';\nimport { DashboardPersonalNotesWidget } from "../notes/DashboardPersonalNotesWidget";')


replacement = """
      case 'personal_notes': {
        return (
          <DashboardPersonalNotesWidget setActiveTab={setActiveTab} />
        );
      }
"""

# use regex to replace case 'personal_notes' ... until the next case or default
content = re.sub(r'case \'personal_notes\': \{.*?\}(?=\s*default:)', replacement.strip() + '\n', content, flags=re.DOTALL)

with open('src/components/reports/FinancialDashboard.tsx', 'w') as f:
    f.write(content)
