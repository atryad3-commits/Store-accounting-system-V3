const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const regex = /if \(business && business.db_type === 'postgres'\) \{\s*const configRaw = await fsPromises.readFile\(DB_CONFIG_FILE, 'utf-8'\);\s*const config = JSON\.parse\(configRaw\);\s*if \(config\.engine === 'postgres' && config\.connectionString\) \{\s*const url = new URL\(config\.connectionString\);\s*url\.pathname = `\/\$\{business\.db_name\}`;\s*const pool = await connectPgDb\(url\.toString\(\)\);\s*activePgPools\[storeId\] = pool;\s*usePgMap\[storeId\] = true;\s*return;\s*\}\s*\}\s*\}\s*catch\(e\)\s*\{\s*\}/m;

content = content.replace(regex, (match) => {
    return match.replace("} catch(e) {}", "} catch(e) { console.error('Caught error in loadPgPoolForStore:', e); }");
});

fs.writeFileSync('server.ts', content);
