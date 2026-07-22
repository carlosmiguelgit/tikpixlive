const https = require('https');
const fs = require('fs');
const path = require('path');

const avatarDir = path.join(__dirname, '..', 'public', 'avatar');
const usersPath = path.join(__dirname, '..', 'src', 'tiktok-users.json');

const USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchUrl(url, ua) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: { 'User-Agent': ua, 'Accept': 'text/html,application/xhtml+xml' },
      timeout: 15000,
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { fs.unlink(dest, () => {}); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function extractAvatarUrl(html) {
  const m = html.match(/data-avatarUrl="([^"]+)"/);
  return m ? decodeURIComponent(m[1]) : null;
}

const remaining = ["tabrielogab", "zleon.ofcz", "erling", "wuesilva", "artthuroficial_", "animaguis", "ronaldinho"];

(async () => {
  const results = [];
  for (const username of remaining) {
    const avatarFile = path.join(avatarDir, `@${username}.png`);
    if (fs.existsSync(avatarFile)) {
      console.log(`@${username} already has avatar, skipping`);
      continue;
    }

    process.stdout.write(`@${username} ... `);
    let success = false;
    for (let attempt = 0; attempt < 3 && !success; attempt++) {
      if (attempt > 0) {
        const wait = 15000 + Math.random() * 10000;
        process.stdout.write(` retry ${attempt+1} in ${Math.round(wait/1000)}s... `);
        await sleep(wait);
      }
      try {
        const html = await fetchUrl(`https://www.tiktok.com/@${username}`, USER_AGENTS[attempt % 2]);
        const avatarUrl = extractAvatarUrl(html);
        if (!avatarUrl) { if (attempt < 2) continue; console.log('no avatar'); break; }
        let nickname = username;
        const m = html.match(/data-nickname="([^"]+)"/);
        if (m) nickname = decodeURIComponent(m[1]);
        await downloadFile(avatarUrl, avatarFile);
        console.log(`OK - ${nickname}`);
        success = true;
        results.push({
          username, nickname, fullName: nickname,
          avatar: `/avatar/@${username}.png`,
          followingCount: Math.floor(Math.random() * 3000) + 100,
          followerCount: Math.floor(Math.random() * 5000) + 200,
        });
      } catch (err) {
        if (attempt < 2) continue;
        console.log(`FAIL - ${err.message}`);
      }
    }
    await sleep(5000 + Math.random() * 3000);
  }

  if (results.length > 0) {
    const existing = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const combined = [...existing, ...results];
    fs.writeFileSync(usersPath, JSON.stringify(combined, null, 2), 'utf-8');
    console.log(`\nAdded ${results.length}. Total: ${combined.length}`);
  } else {
    console.log('\nNo new users added');
  }
})();
