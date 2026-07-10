with open("src/App.tsx", "r") as f:
    app = f.read()

app = app.replace(
    '<span className="text-xs font-black font-mono">v1.0.0</span>',
    '<span className="text-xs font-black font-mono">v{changelogData[0]?.version || "1.0.0"}</span>'
)

with open("src/App.tsx", "w") as f:
    f.write(app)
