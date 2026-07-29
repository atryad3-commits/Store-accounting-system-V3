const os = require('os');
console.log(os.platform(), os.arch(), os.totalmem(), os.freemem(), os.cpus().length);
