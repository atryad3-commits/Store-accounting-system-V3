with open("src/App.tsx", "r") as f:
    app = f.read()

import_statement = "import ChangelogModal from './components/ChangelogModal';\nimport changelogData from './data/changelog.json';\n"
if "import ChangelogModal from" not in app:
    app = app.replace("import './index.css';", "import './index.css';\n" + import_statement)

with open("src/App.tsx", "w") as f:
    f.write(app)
