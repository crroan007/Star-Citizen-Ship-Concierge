import fs from 'fs';
import path from 'path';
import { https } from 'follow-redirects';

// Configuration
const SHIPS_TO_HARVEST = [
    { name: '300i', url: 'https://fleetyards.net/ships/300i/' }
];

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

async function harvestShip(shipName: string, pageUrl: string) {
    console.log(`[${shipName}] Inspecting page: ${pageUrl}`);

    // 1. Fetch Page HTML to find the model URL (regex match based on my previous research)
    // We look for the pattern: https://cdn.fleetyards.net/uploads/model/holo/.../holo-v2-....gltf
    try {
        const html = await fetchText(pageUrl);
        const modelUrlMatch = html.match(/https:\/\/cdn\.fleetyards\.net\/uploads\/model\/holo\/[^"']+\.gltf/);

        if (!modelUrlMatch) {
            console.error(`[${shipName}] ❌ No 3D model found in HTML.`);
            return;
        }

        const modelUrl = modelUrlMatch[0];
        console.log(`[${shipName}] Found model URL: ${modelUrl}`);

        // 2. Download the .gltf
        const filename = `${shipName}.gltf`;
        const filePath = path.join(MODELS_DIR, filename);

        await downloadFile(modelUrl, filePath);
        console.log(`[${shipName}] ✅ Downloaded to ${filePath}`);

    } catch (error) {
        console.error(`[${shipName}] Parsing error:`, error);
    }
}

// Helpers
function fetchText(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(err));
        });
    });
}

function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
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

// Main
(async () => {
    console.log('🚀 Starting 3D Model Harvest...');
    for (const ship of SHIPS_TO_HARVEST) {
        await harvestShip(ship.name, ship.url);
    }
    console.log('🏁 Harvest complete.');
})();
