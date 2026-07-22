const https = require('https');
const fs = require('fs');
const path = require('path');

const avatarDir = path.join(__dirname, '..', 'public', 'avatar');
const usersPath = path.join(__dirname, '..', 'src', 'tiktok-users.json');

const USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
];

const REAL_USERNAMES = [
  "voceprecisaprovar", "marcellean", "boredance", "sosianey",
  "d4vinhokun", "injayne", "carla.mpessoa", "jullymolinna",
  "mateuspesce", "comentaristaedu", "lagaitanbrasil", "pigzadaxd",
  "biakvint", "mamontellato", "morimura", "richardrios0206",
  "tabrielogab", "euwillou", "nikolasferreiradm", "rodrigomunozzz",
  "slanpad", "priscilaevellyn", "arthurpaek", "brunalohaiine",
  "vitororth", "pedroallann", "jpvictorxz", "steeevez",
  "slingff_", "cisquix", "pkllipe", "jotaceditzbr",
  "etanega", "maluborgesm", "estheralbrechtt", "neckolau",
  "luismariz", "zleon.ofcz", "marcotuliodavi", "joaopedrochaseliov",
  "diariasdogui", "nathaliavalente", "emillyvickof", "melmaia",
  "alencarzaoficial", "luisasonza", "larissamanoela", "camilapudim",
  "vanessalopesr", "marimaria"
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchUrl(url, ua) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml',
      },
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
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function extractAvatarUrl(html) {
  const m = html.match(/data-avatarUrl="([^"]+)"/);
  if (!m) return null;
  return decodeURIComponent(m[1]);
}

async function main() {
  const existingAvatars = new Set(
    fs.readdirSync(avatarDir).map(f => f.replace('.png', '').replace('@', ''))
  );

  const toFetch = REAL_USERNAMES.filter(u => !existingAvatars.has(u));
  console.log(`Already have ${REAL_USERNAMES.length - toFetch.length} avatars. Need to fetch ${toFetch.length}`);

  const results = [];

  for (let i = 0; i < toFetch.length; i++) {
    const username = toFetch[i];
    const ua = USER_AGENTS[i % USER_AGENTS.length];

    process.stdout.write(`[${i+1}/${toFetch.length}] @${username} ... `);

    let success = false;
    for (let attempt = 0; attempt < 3 && !success; attempt++) {
      if (attempt > 0) {
        const wait = (attempt * 10000) + Math.random() * 5000;
        process.stdout.write(` retry ${attempt+1} in ${wait/1000}s... `);
        await sleep(wait);
      }

      try {
        const html = await fetchUrl(`https://www.tiktok.com/@${username}`, ua);
        const avatarUrl = extractAvatarUrl(html);

        if (!avatarUrl) {
          if (attempt < 2) continue;
          console.log('no avatar');
          break;
        }

        let nickname = username;
        const titleMatch = html.match(/data-nickname="([^"]+)"/);
        if (titleMatch) {
          nickname = decodeURIComponent(titleMatch[1]);
        }

        const avatarFile = path.join(avatarDir, `@${username}.png`);
        await downloadFile(avatarUrl, avatarFile);
        console.log(`OK - ${nickname}`);
        success = true;

        const followingCount = Math.floor(Math.random() * 3000) + 100;
        const followerCount = Math.floor(Math.random() * 5000) + 200;

        results.push({
          username,
          nickname,
          fullName: nickname,
          avatar: `/avatar/@${username}.png`,
          followingCount,
          followerCount,
        });
      } catch (err) {
        if (attempt < 2) continue;
        console.log(`FAIL - ${err.message}`);
      }
    }

    await sleep(3000 + Math.random() * 2000);
  }

  const existing = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const existingUsernames = new Set(existing.map(u => u.username));
  const kept = existing.filter(u => existingUsernames.has(u.username));
  const combined = [...kept, ...results];

  fs.writeFileSync(usersPath, JSON.stringify(combined, null, 2), 'utf-8');
  console.log(`\nDone! Added ${results.length} real users. Total: ${combined.length}`);
}

main();
