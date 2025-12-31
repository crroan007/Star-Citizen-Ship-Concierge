
import fs from 'fs';
import path from 'path';
import { harvestHardpoints, ShipConfig } from '../lib/hardpoint-harvester';

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');
const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'ships');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log(`[Catalog] Scanning ${MODELS_DIR}...`);

const files = fs.readdirSync(MODELS_DIR);
const gltfFiles = files.filter(f => f.endsWith('.gltf'));

console.log(`[Catalog] Found ${gltfFiles.length} GLTF models.`);

gltfFiles.forEach(file => {
    const shipId = file.replace('.gltf', '');
    const fullPath = path.join(MODELS_DIR, file);
    const configPath = path.join(DATA_DIR, `${shipId}.json`);

    try {
        console.log(`[Catalog] Processing ${shipId}...`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const json = JSON.parse(content);

        if (!json.nodes) {
            console.warn(`[Catalog] Warning: No nodes found in ${file}`);
            return;
        }

        const hardpoints = harvestHardpoints(json.nodes);

        const config: ShipConfig = {
            id: shipId,
            name: shipId.toUpperCase(),
            modelPath: `/models/${file}`,
            hardpoints: hardpoints
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`[Catalog] \x1b[32mSuccess: Saved ${shipId}.json (${hardpoints.length} hardpoints)\x1b[0m`);

    } catch (err) {
        console.error(`[Catalog] \x1b[31mError processing ${file}:\x1b[0m`, err);
    }
});

console.log('[Catalog] Done.');
