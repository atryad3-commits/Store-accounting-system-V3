import json

with open("package.json", "r") as f:
    data = json.load(f)

if "prebuild" not in data["scripts"]:
    data["scripts"]["prebuild"] = "node generate-version.js"
    # let's also put it in dev just so it updates occasionally? Nah, prebuild is good.

with open("package.json", "w") as f:
    json.dump(data, f, indent=2)
