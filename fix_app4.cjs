const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let inRoutes = false;
let openElement = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('<Routes>')) inRoutes = true;
  if (line.includes('</Routes>')) inRoutes = false;
  
  if (inRoutes) {
      if (line.includes('<Route ')) {
          // If the line has element={ but doesn't have } />
          // Wait, if it has a self closing component on the same line and sed broke it:
          // sed changed `element={<Comp />} />` to `element={<Comp />` or `element={<Comp`?
          // If original was `<Route ... element={<Comp />} />`
          // sed removes `} />`, it becomes `<Route ... element={<Comp />`
          // WAIT! `} />` has a space before `/>`. If it was `<Comp />} />`, then it matches `} />`. It becomes `<Comp />`!
          // So line 765: `<Route path="/accounts" element={<AccountsManager />`
          // But my auto_fix appended `} />` to some lines! Let's clean up auto_fix's mess first!
      }
  }
}
