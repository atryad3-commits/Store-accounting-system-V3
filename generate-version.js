import fs from 'fs';
import { execSync } from 'child_process';
import crypto from 'crypto';

let hash = '';
let dateStr = '';
let changes = [];

try {
  hash = execSync('git rev-parse --short HEAD').toString().trim();
  const gitLog = execSync('git log -1 --pretty=%B').toString().trim();
  changes = gitLog.split('\n').filter(line => line.trim().length > 0);
} catch (e) {
  hash = crypto.randomBytes(4).toString('hex');
  changes = ["بروزرسانی خودکار سیستم", "بهبود عملکرد کلی"];
}

// Convert current date to Persian date string
const dateObj = new Date();
const intlDate = new Intl.DateTimeFormat('fa-IR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
}).format(dateObj);
dateStr = intlDate;

const versionObj = {
  hash,
  date: dateStr
};

fs.writeFileSync('src/version.json', JSON.stringify(versionObj, null, 2));

// Update changelog if possible
try {
    let changelog = [];
    if (fs.existsSync('src/data/changelog.json')) {
        changelog = JSON.parse(fs.readFileSync('src/data/changelog.json', 'utf8'));
    }
    
    // Only push if hash is different from the latest one
    if (changelog.length === 0 || changelog[0].hash !== hash) {
        // Calculate new version number
        let newVersion = "1.0.0";
        if (changelog.length > 0) {
            const lastVersion = changelog[0].version;
            const parts = lastVersion.split('.');
            parts[2] = parseInt(parts[2]) + 1;
            newVersion = parts.join('.');
        }

        const newEntry = {
            version: newVersion,
            date: dateStr,
            type: "feature",
            title: "بروزرسانی سیستم (" + hash + ")",
            changes: changes,
            hash: hash
        };
        
        changelog.unshift(newEntry);
        fs.writeFileSync('src/data/changelog.json', JSON.stringify(changelog, null, 2));
    }
} catch(e) {
    console.error("Could not update changelog", e);
}

console.log(`Version generated: ${hash} at ${dateStr}`);
