// Keep Render service warm
const https = require('https');

const BACKEND_URL = 'https://careerai-efza.onrender.com/api/health';

function keepWarm() {
  https.get(BACKEND_URL, (res) => {
    console.log(`Keep-warm ping: ${res.statusCode} at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    console.error('Keep-warm failed:', err.message);
  });
}

// Ping every 14 minutes (Render sleeps after 15 minutes of inactivity)
setInterval(keepWarm, 14 * 60 * 1000);

console.log('Keep-warm service started');
keepWarm(); // Initial ping