const fs = require('fs');
const path = require('path');
const https = require('https');

const SHIPS_TO_HARVEST = [
    {
        name: '300i',
        directUrl: 'https://cdn.fleetyards.net/uploads/model/holo/4a/62/4dcc-5e61-4166-822a-2d918edc5910/holo-v2-22eafbfe-ee0b-4cee-83c1-fa0af5bd2705.gltf'
    }
];

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

(async () => {
    console.log('🚀 Starting robust harvest...');
    for (const ship of SHIPS_TO_HARVEST) {
        console.log(`[${ship.name}] Downloading...`);
        try {
            const filename = `${ship.name}.gltf`;
            const filePath = path.join(MODELS_DIR, filename);
            await downloadFile(ship.directUrl, filePath);
            console.log(`[${ship.name}] ✅ Success: ${filePath}`);
        } catch (e) {
            console.error(`[${ship.name}] ❌ Error:`, e);
        }
    }
})();
