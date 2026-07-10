with open("src/App.tsx", "r") as f:
    app = f.read()

app = app.replace(
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);",
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);\n  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);"
)

with open("src/App.tsx", "w") as f:
    f.write(app)
