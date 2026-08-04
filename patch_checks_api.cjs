const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// For issued checks logic:
file = file.replace(
  /app\.post\('\/api\/data\/issued_checks', async \(req, res\) => \{([\s\S]*?)const data = Array\.isArray\(req\.body\) \? req\.body : \[req\.body\];/m,
  `app.post('/api/data/issued_checks', async (req, res) => {
    checksSummaryCache = null;
    const validation = validateData('issued_checks', req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', details: validation.error.errors });
    }
    
    // Check threshold
    const defaultDb = storeContext.run('default', () => getDb());
    const settingsRes = defaultDb.prepare("SELECT value FROM local_data WHERE key = 'company_profile'").get();
    let threshold = 0;
    if (settingsRes && settingsRes.value) {
        const settings = JSON.parse(settingsRes.value);
        threshold = settings.checkApprovalThreshold || 0;
    }
    
    const userId = req.user?.id || req.user?.username || 'system';

    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];`
);

// Add creatorId, approvalStatus to inserted values for issuedChecks
file = file.replace(
  /checkbookId: item\.checkbookId \? String\(item\.checkbookId\) : null,\n\s*checkNumber: String\(item\.checkNumber \|\| item\.id\),/m,
  `checkbookId: item.checkbookId ? String(item.checkbookId) : null,
           creatorId: item.creatorId || userId,
           approvalStatus: (threshold > 0 && Number(item.amount) > threshold) ? 'pending_approval' : 'approved',
           checkNumber: String(item.checkNumber || item.id),`
);

// For received checks logic:
file = file.replace(
  /app\.post\('\/api\/data\/received_checks', async \(req, res\) => \{([\s\S]*?)const data = Array\.isArray\(req\.body\) \? req\.body : \[req\.body\];/m,
  `app.post('/api/data/received_checks', async (req, res) => {
    checksSummaryCache = null;
    const validation = validateData('received_checks', req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', details: validation.error.errors });
    }
    
    // Check threshold
    const defaultDb = storeContext.run('default', () => getDb());
    const settingsRes = defaultDb.prepare("SELECT value FROM local_data WHERE key = 'company_profile'").get();
    let threshold = 0;
    if (settingsRes && settingsRes.value) {
        const settings = JSON.parse(settingsRes.value);
        threshold = settings.checkApprovalThreshold || 0;
    }
    
    const userId = req.user?.id || req.user?.username || 'system';

    try {
      const data = Array.isArray(req.body) ? req.body : [req.body];`
);

// Add creatorId, approvalStatus to inserted values for receivedChecks
file = file.replace(
  /id: String\(item\.id\),\n\s*checkNumber: String\(item\.checkNumber \|\| item\.id\),/m,
  `id: String(item.id),
           creatorId: item.creatorId || userId,
           approvalStatus: (threshold > 0 && Number(item.amount) > threshold) ? 'pending_approval' : 'approved',
           checkNumber: String(item.checkNumber || item.id),`
);

fs.writeFileSync('server.ts', file);
