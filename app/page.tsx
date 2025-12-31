"use client";

import { useState } from "react";
import HoloViewer from "@/components/HoloViewer";
import MiniShipPreview from "@/components/MiniShipPreview";
import ShipStatsOverlay from "@/components/ShipStatsOverlay";

export default function Home() {
    const [currentShip, setCurrentShip] = useState('300i');

    const ships = [
        { id: '300i', name: 'ORIGIN 300i' },
        { id: 'f8c', name: 'ANVIL F8C' },
    ];

    return (
        <main className="relative w-full h-screen overflow-hidden bg-sc-black selection:bg-sc-blue selection:text-sc-black">
            {/* Background elements (Stars/Grid could go here) */}

            {/* Left Panel: Consultant HUD - Floating Glass Card */}
            <div className="absolute left-10 top-10 bottom-10 w-[400px] flex flex-col gap-6 z-20">

                {/* Header Block */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-orbitron font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        ARK<span className="text-sc-blue">_</span>CONSULTANT
                    </h1>
                    <div className="h-0.5 w-20 bg-sc-alert/80" />
                </div>

                {/* Status Card */}
                <div className="p-6 rounded-xl border border-white/5 bg-black/20 backdrop-blur-xl shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-orbitron font-bold tracking-[0.2em] text-sc-blue uppercase">System Status</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-sc-blue animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-sc-blue/30" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-orbitron tracking-wide text-tesla-white mb-1">
                        {ships.find(s => s.id === currentShip)?.name || currentShip.toUpperCase()}
                    </h2>
                    <p className="text-xs font-inter text-white/40 tracking-wide">
                        MODE: <span className="text-white/80">INTERACTIVE_VISUALIZATION</span>
                    </p>
                </div>

                {/* Ship List - "Hangar Link" */}
                <div className="flex-1 rounded-xl border border-white/5 bg-black/20 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <h3 className="text-[10px] font-orbitron font-bold text-white/60 tracking-[0.2em] uppercase">
                            Available Hull Configs
                        </h3>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
                        {ships.map(ship => {
                            const isActive = currentShip === ship.id;
                            return (
                                <div
                                    key={ship.id}
                                    onClick={() => setCurrentShip(ship.id)}
                                    className={`group relative flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden
                                        ${isActive
                                            ? 'border-sc-blue/50 bg-sc-blue/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                                            : 'border-white/5 bg-transparent hover:border-sc-alert/50 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sc-blue shadow-[0_0_10px_#00f0ff]" />
                                    )}

                                    {/* Mini Preview Container */}
                                    <div className="relative z-10">
                                        <MiniShipPreview modelPath={`/models/${ship.id}.gltf`} active={isActive} />
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex flex-col z-10">
                                        <span className={`font-orbitron text-sm tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                                            {ship.name}
                                        </span>
                                        <span className="text-[10px] font-inter text-white/30 tracking-widest uppercase group-hover:text-sc-alert transition-colors">
                                            {isActive ? '>> ACTILINK' : 'STANDBY'}
                                        </span>
                                    </div>

                                    {/* Hover Background Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full`} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Console Log Mock */}
                <div className="p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-md">
                    <p className="font-mono text-[10px] text-sc-blue/60 leading-relaxed">
                        {`> CONNECTION_ESTABLISHED`}<br />
                        {`> RENDER_PIPELINE: ACTIVE`}<br />
                        <span className="text-white/20">{`> AWAITING_INPUT...`}</span>
                    </p>
                </div>
            </div>

            {/* Right Panel: Hologram */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {/* Stats Overlay - Behind interaction but visible */}
                <ShipStatsOverlay shipId={currentShip} />

                {/* 3D Canvas must have pointer interactions allowed */}
                <div className="w-full h-full pointer-events-auto">
                    <HoloViewer modelPath={`/models/${currentShip}.gltf`} />
                </div>
            </div>
        </main>
    );
}
