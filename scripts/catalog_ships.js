
const fs = require('fs');
const path = require('path');

function harvestHardpoints(nodes) {
    const detectedHardpoints = [];

    const blacklistKeywords = [
        'controller', 'helper', 'proxy', 'ik', 'anim', 'flair', 'light', 'geom', 'port', 'ui', 'detail',
        'pool', 'regen', 'destroyed', 'door', 'seat', 'bed', 'toilet', 'cargo', 'landing', 'ladder',
        'access', 'storage', 'paint', 'visarea', 'zone', 'cull', 'cam', 'nav', 'phys', 'sfx', 'vfx', 'destruct'
    ];

    nodes.forEach((node) => {
        let name = node.name?.toLowerCase();
        if (!name) return;

        // 1. FILTER: Duplicates and Clutter
        if (name.includes('missile') && !name.includes('rack')) return;
        if (name.includes('launcher_slot')) return;
        if (name.includes('attach')) return;
        if (name.includes('weapon_mount') && !name.includes('hardpoint')) return;

        // 300i Specifics
        if (name.includes('cabinet')) return;
        if (name.includes('rack') && !name.includes('missile')) return;

        // 2. TARGET: Must be a 'hardpoint_' node
        if (!name.includes('hardpoint_')) return;

        // 3. BLACKLIST
        if (blacklistKeywords.some(b => name.includes(b))) return;

        // 4. CLASSIFICATION & LABELING
        let type = 'utility';
        if (name.includes('weapon')) type = 'weapon';
        if (name.includes('missile') || name.includes('rack')) type = 'missile';
        if (name.includes('turret')) type = 'turret';

        if (type === 'utility') return;

        let label = node.name.toUpperCase();

        // CLEANUP
        label = label
            .replace(/^.*HARDPOINT_/, '')
            .replace(/^.*MOUNT_/, '')
            .replace('WEAPON_', '')
            .replace(/_\d+$/, '')
            .replace(/\.00\d$/, '');

        // ABBREVIATIONS
        label = label
            .replace(/_/g, ' ')
            .replace(/\bLEFT\b/g, 'L')
            .replace(/\bRIGHT\b/g, 'R')
            .replace(/\bNOSE\b/g, 'NOSE')
            .replace(/\bWING\b/g, 'WING')
            .replace(/\bINNER\b/g, '(INNER)')
            .replace(/\bOUTER\b/g, '(OUTER)')
            .replace(/\bTURRET\b/g, 'TURRET');

        // SIZE PARSING
        const sizeMatch = name.match(/_s(\d{1})_|_size(\d{1})_/i) || label.match(/\bS(\d{1})\b/);
        let sizeStr = '';
        if (sizeMatch) {
            const sVal = sizeMatch[1] || sizeMatch[2];
            sizeStr = ` (S${sVal})`;
            label = label.replace(new RegExp(`\\bS${sVal}\\b`, 'gi'), '').replace(/\s+/g, ' ');
        }

        label = (label.trim() + sizeStr).trim();

        detectedHardpoints.push({
            id: node.name,
            label: label,
            type: type
        });
    });

    // 5. DEDUPING & TURRET CONSOLIDATION
    const uniqueHardpoints = new Map();
    const turretGroups = new Map();

    detectedHardpoints.forEach(hp => {
        if (hp.type === 'turret') {
            const baseLabel = hp.label.replace(/\s+[LR]$/, '').trim();
            if (!turretGroups.has(baseLabel)) {
                turretGroups.set(baseLabel, []);
            }
            turretGroups.get(baseLabel).push(hp);
        } else {
            if (!uniqueHardpoints.has(hp.label)) {
                uniqueHardpoints.set(hp.label, hp);
            } else {
                const current = uniqueHardpoints.get(hp.label);
                if (hp.id.length < current.id.length) {
                    uniqueHardpoints.set(hp.label, hp);
                }
            }
        }
    });

    turretGroups.forEach((group, baseLabel) => {
        group.sort((a, b) => a.id.length - b.id.length);
        const parent = group.find(t => t.label === baseLabel);

        if (parent) {
            uniqueHardpoints.set(baseLabel, parent);
        } else {
            const representative = group[0];
            representative.label = baseLabel;
            uniqueHardpoints.set(baseLabel, representative);
        }
    });

    return Array.from(uniqueHardpoints.values())
        .sort((a, b) => a.label.localeCompare(b.label));
}


const MODELS_DIR = path.join(process.cwd(), 'public', 'models');
const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'ships');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const logFile = path.join(process.cwd(), 'catalog_debug.log');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

fs.writeFileSync(logFile, 'Starting catalog...\n');

const files = fs.readdirSync(MODELS_DIR);
const gltfFiles = files.filter(f => f.endsWith('.gltf'));

log(`Found ${gltfFiles.length} GLTF models: ${gltfFiles.join(', ')}`);

gltfFiles.forEach(file => {
    const shipId = file.replace('.gltf', '');
    const fullPath = path.join(MODELS_DIR, file);
    const configPath = path.join(DATA_DIR, `${shipId}.json`);

    try {
        log(`Processing ${shipId}...`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const json = JSON.parse(content);

        if (!json.nodes) {
            log(`Warning: No nodes found in ${file}`);
            return;
        }

        const hardpoints = harvestHardpoints(json.nodes);

        const config = {
            id: shipId,
            name: shipId.toUpperCase(),
            modelPath: `/models/${file}`,
            hardpoints: hardpoints
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        log(`Success: Saved ${shipId}.json (${hardpoints.length} hardpoints)`);

    } catch (err) {
        log(`Error processing ${file}: ${err.message}`);
    }
});

log('Done.');
