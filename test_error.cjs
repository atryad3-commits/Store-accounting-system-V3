const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
    console.log(err.stack);
  });
  
  page.on('error', err => {
    console.log('ERROR:', err.message);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.log("Goto timeout"));
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
