import re

with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    content = f.read()

# Remove the effectiveViewMode declaration from the top
content = content.replace("  const effectiveViewMode = isMobile ? \"list\" : personsViewMode;\n", "")

# Add it after the destructuring
# Wait, the destructuring ends with: setActiveTab, } = props;
# Let's insert it after that.
props_end = "setActiveTab,\n  } = props;"
content = content.replace(props_end, props_end + "\n  const effectiveViewMode = isMobile ? \"list\" : personsViewMode;")
content = content.replace("setActiveTab } = props;", "setActiveTab } = props;\n  const effectiveViewMode = isMobile ? \"list\" : personsViewMode;")

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(content)
