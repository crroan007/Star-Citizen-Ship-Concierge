const fs = require('fs');

try {
    const content = fs.readFileSync('public/models/300i.gltf', 'utf8');
    const gltf = JSON.parse(content);

    console.log('--- Inspector Start ---');
    if (!gltf.nodes) {
        console.log('No "nodes" array found.');
    } else {
        console.log(`Total Nodes: ${gltf.nodes.length}`);
        const names = gltf.nodes.map(n => n.name || 'Unnamed');

        // Look for hardpoint candidates
        const hardpoints = names.filter(n =>
            n.includes('hardpoint') ||
            n.includes('hp') ||
            n.includes('mnt') ||
            n.includes('weapon')
        );

        if (hardpoints.length > 0) {
            console.log('Potential Hardpoints Found:');
            // Write to file
            const fs = require('fs');
            fs.writeFileSync('hardpoints_list.txt', hardpoints.join('\n'));
            console.log('Written to hardpoints_list.txt');
        } else {
            console.log('No obvious hardpoint names found. First 20 nodes:');
            console.log(names.slice(0, 20).join('\n'));
        }
    }
} catch (e) {
    console.error('Error:', e);
}
console.log('--- Inspector End ---');
