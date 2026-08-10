const fs = require('fs');
let content = fs.readFileSync('src/utils/dateFormatter.ts', 'utf-8');

content = content.replace(
  /updateConfig\(config: Partial<DateDisplayConfig>\) \{\s*this\.config = \{ \.\.\.this\.config, \.\.\.config \};\s*\}/,
  `updateConfig(config: Partial<DateDisplayConfig>) {
    const cleanedConfig = Object.fromEntries(
      Object.entries(config).filter(([_, v]) => v !== undefined)
    );
    this.config = { ...this.config, ...cleanedConfig };
  }`
);

fs.writeFileSync('src/utils/dateFormatter.ts', content);
