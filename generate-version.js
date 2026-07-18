import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;
const buildTime = new Date().toISOString();
fs.writeFileSync('./src/version.ts', `export const appVersion = '${version}';\nexport const buildTime = '${buildTime}';\n`);
console.log('Version generated:', version);
