import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { harvestHardpoints, ShipConfig } from '../../../lib/hardpoint-harvester';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const shipId = searchParams.get('shipId');

    if (!shipId) {
        return NextResponse.json({ error: 'Missing shipId' }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), 'public', 'data', 'ships', `${shipId}.json`);

    // 1. CHECK CACHE
    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            console.log(`[API] Serving cached config for ${shipId}`);
            return NextResponse.json(config);
        } catch (e) {
            console.error('[API] Error reading cache:', e);
        }
    }

    // 2. HARVEST MODE
    console.log(`[API] Harvesting config for ${shipId}...`);

    const modelsDir = path.join(process.cwd(), 'public', 'models');
    let modelFile = `${shipId}.gltf`;

    // Check for .gltf
    if (!fs.existsSync(path.join(modelsDir, modelFile))) {
        // Fallback or error if GLB (since we don't support GLB parsing yet)
        console.error(`[API] Model not found: ${modelFile}`);
        return NextResponse.json({ error: `Model not found for ${shipId}` }, { status: 404 });
    }

    try {
        const fullModelPath = path.join(modelsDir, modelFile);
        const fileContent = fs.readFileSync(fullModelPath, 'utf-8');
        const gltfJson = JSON.parse(fileContent);
        const nodes = gltfJson.nodes || [];

        // USE SHARED LOGIC
        const finalHardpoints = harvestHardpoints(nodes);

        const newConfig: ShipConfig = {
            id: shipId,
            name: shipId.toUpperCase(),
            modelPath: `/models/${modelFile}`,
            hardpoints: finalHardpoints
        };

        // SAVE IT
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        console.log(`[API] Generated and saved config for ${shipId}`);

        return NextResponse.json(newConfig);

    } catch (err) {
        console.error('Harvest Error:', err);
        return NextResponse.json({ error: 'Failed to harvest hardpoints' }, { status: 500 });
    }
}
