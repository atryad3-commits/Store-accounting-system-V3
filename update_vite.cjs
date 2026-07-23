const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

const buildConfig = `
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              if (id.includes('@tanstack')) {
                return 'vendor-query';
              }
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              if (id.includes('react-multi-date-picker') || id.includes('react-date-object')) {
                return 'vendor-date';
              }
              return 'vendor-others';
            }
          }
        }
      }
    },`;

content = content.replace(`server: {`, `${buildConfig}\n    server: {`);

fs.writeFileSync('vite.config.ts', content);
console.log("Updated vite.config.ts with manualChunks");
