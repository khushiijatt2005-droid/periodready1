const https = require('https');

const TUNNEL_URL = 'https://bras-optional-oct-traditions.trycloudflare.com';

function ping() {
  https.get(TUNNEL_URL + '/api/products', (res) => {
    // console.log(`Ping ${res.statusCode} at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    // console.error('Ping error:', err.message);
  });
}

ping();
setInterval(ping, 25000);
