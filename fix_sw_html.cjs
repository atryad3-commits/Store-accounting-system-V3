const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('serviceWorker.getRegistrations')) {
  html = html.replace('</body>', `  <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
    </script>
  </body>`);
  fs.writeFileSync('index.html', html);
}
