"use client";

import { shipStats } from "@/lib/mock-ship-stats";
import TypewriterText from "./TypewriterText";

export default function ShipStatsOverlay({ shipId }: { shipId: string }) {
    const stats = shipStats[shipId];

    if (!stats) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none p-8 flex flex-col justify-between font-mono text-xs text-sc-blue/70">
            {/* Top Row */}
            <div className="flex justify-between items-start">
                {/* Top Left: Manufacturer & Focus */}
                <div className="flex flex-col gap-1 max-w-[200px]">
                    <h3 className="text-white font-bold tracking-widest uppercase mb-1 border-b border-sc-blue/30 pb-1">
                        <TypewriterText text="MANUFACTURER_DATA" trigger={shipId} />
                    </h3>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-white/50">ORG:</span>
                        <TypewriterText text={stats.manufacturer} trigger={shipId} className="text-sc-blue" />
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2">
                        <span className="text-white/50">CLASS:</span>
                        <TypewriterText text={stats.focus} trigger={shipId} className="text-sc-alert" />
                    </div>
                </div>

                {/* Top Right: Crew & Capacity */}
                <div className="flex flex-col gap-1 text-right max-w-[200px]">
                    <h3 className="text-white font-bold tracking-widest uppercase mb-1 border-b border-sc-blue/30 pb-1">
                        <TypewriterText text="OPERATIONAL_CAPS" trigger={shipId} />
                    </h3>
                    <div>
                        <span className="text-white/50 mr-2">MIN_CREW:</span>
                        <TypewriterText text={stats.crew.min} trigger={shipId} />
                    </div>
                    <div>
                        <span className="text-white/50 mr-2">MAX_CREW:</span>
                        <TypewriterText text={stats.crew.max} trigger={shipId} />
                    </div>
                    <div className="mt-2 text-sc-alert/80">
                        <TypewriterText text=">> SYSTEMS_GREEN" trigger={shipId} delay={1000} />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-end">
                {/* Bottom Left: Technical Specs */}
                <div className="flex flex-col gap-1 max-w-[200px]">
                    <h3 className="text-white font-bold tracking-widest uppercase mb-1 border-b border-sc-blue/30 pb-1">
                        <TypewriterText text="TECHNICAL_READOUT" trigger={shipId} />
                    </h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[9px]">
                        <span className="text-white/50">LEN:</span>
                        <TypewriterText text={stats.specs.length} trigger={shipId} />

                        <span className="text-white/50">BEAM:</span>
                        <TypewriterText text={stats.specs.beam} trigger={shipId} />

                        <span className="text-white/50">HGT:</span>
                        <TypewriterText text={stats.specs.height} trigger={shipId} />

                        <span className="text-white/50">MASS:</span>
                        <TypewriterText text={stats.specs.mass} trigger={shipId} />
                    </div>
                </div>

                {/* Bottom Right: Description / Flavor Text */}
                <div className="flex flex-col gap-1 text-right max-w-[300px]">
                    <h3 className="text-white font-bold tracking-widest uppercase mb-1 border-b border-sc-blue/30 pb-1">
                        <TypewriterText text="ARCHIVE_ENTRY" trigger={shipId} />
                    </h3>
                    <p className="leading-relaxed text-white/50">
                        <TypewriterText text={stats.description} speed={10} trigger={shipId} />
                    </p>
                </div>
            </div>
        </div>
    );
}
