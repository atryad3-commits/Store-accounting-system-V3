const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const search = `  app.use(cookieParser());`;
const replace = `  app.use(cookieParser());

  // === AUTH MIDDLEWARE FOR API ===
  app.use((req, res, next) => {
    const publicPaths = ['/api/auth/login', '/api/auth/verify-otp', '/api/auth/refresh', '/api/auth/logout', '/api/setup/status'];
    if (!req.path.startsWith('/api/') || publicPaths.includes(req.path)) {
       return next();
    }
    
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
       token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.refreshToken) {
       token = req.cookies.refreshToken; // Fallback for some routes if needed
    }
    
    if (!token) {
       return res.status(401).json({ error: 'عدم احراز هویت' });
    }
    
    try {
       const JWT_SECRET_MW = process.env.JWT_SECRET || 'super-secret-jwt-key-2024';
       const JWT_REFRESH_MW = process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-2024';
       
       try {
           const decoded = jwt.verify(token, JWT_SECRET_MW);
           req.user = decoded;
       } catch (err) {
           const decoded = jwt.verify(token, JWT_REFRESH_MW);
           req.user = decoded;
       }
       next();
    } catch(e) {
       return res.status(401).json({ error: 'توکن نامعتبر است' });
    }
  });
  // ================================`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync('server.ts', content);
    console.log("Updated server.ts with auth middleware");
} else {
    console.log("Search string not found in server.ts");
}
