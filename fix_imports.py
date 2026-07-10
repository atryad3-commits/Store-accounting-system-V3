with open("src/App.tsx", "r") as f:
    app = f.read()

import_statement = "import ChangelogModal from './components/ChangelogModal';\nimport changelogData from './data/changelog.json';\n"
app = import_statement + app

with open("src/App.tsx", "w") as f:
    f.write(app)
