const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '../public/models/300i.gltf');

try {
    const raw = fs.readFileSync(modelPath, 'utf8');
    const gltf = JSON.parse(raw);

    console.log(`Total Nodes: ${gltf.nodes.length}`);

    // 1. Find all potential hardpoints
    const candidates = gltf.nodes
        .map(n => n.name)
        .filter(name => {
            const n = name.toLowerCase();
            return n.includes('hardpoint') || n.includes('weapon') || n.includes('missile') || n.includes('turret') || n.includes('rack');
        })
        .sort();

    console.log(candidates.join('\n'));
} catch (err) {
    console.error('Error reading model:', err);
}
