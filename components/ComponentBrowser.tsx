"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Crosshair, Zap, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { MOCK_COMPONENTS, ShipComponent } from "@/lib/mock-components";

interface ComponentBrowserProps {
    isOpen: boolean;
    onClose: () => void;
    targetHardpoint: {
        id: string;
        label: string;
        type: string;
        size?: number; // Parsed from label if not explicit
    } | null;
    onEquip: (component: ShipComponent) => void;
}

export default function ComponentBrowser({ isOpen, onClose, targetHardpoint, onEquip }: ComponentBrowserProps) {
    // 1. Parse Hardpoint Data (Size Heuristics)
    const constraints = useMemo(() => {
        if (!targetHardpoint) return null;

        let size = 1; // Default
        // Try to extract size from "L Wing Inner (S3)"
        const match = targetHardpoint.label.match(/\(S(\d+)\)/);
        if (match) {
            size = parseInt(match[1]);
        }

        return {
            type: targetHardpoint.type,
            size: size
        };
    }, [targetHardpoint]);

    // 2. Filter Mock Data
    const availableItems = useMemo(() => {
        if (!constraints) return [];
        return MOCK_COMPONENTS.filter(c =>
            c.type === constraints.type &&
            c.size === constraints.size
        );
    }, [constraints]);

    return (
        <AnimatePresence>
            {isOpen && targetHardpoint && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute top-20 right-20 w-[400px] h-[600px] z-50 pointer-events-auto"
                >
                    {/* Glass Container */}
                    <div className="w-full h-full rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-sc-blue/20 to-transparent">
                            <div>
                                <h2 className="text-white font-bold text-lg font-mono flex items-center gap-2">
                                    <Crosshair className="w-5 h-5 text-sc-blue" />
                                    COMPONENT BROWSER
                                </h2>
                                <p className="text-xs text-white/50 font-mono mt-1">
                                    TARGET: <span className="text-sc-gold">{targetHardpoint.label}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* List Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {availableItems.length === 0 ? (
                                <div className="text-center text-white/30 py-10 font-mono">
                                    NO COMPATIBLE COMPONENTS FOUND (S{constraints?.size})
                                </div>
                            ) : (
                                availableItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="group relative p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-sc-blue/10 hover:border-sc-blue/50 transition-all cursor-pointer"
                                        onClick={() => onEquip(item)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-white font-bold text-sm tracking-wide">{item.name}</h3>
                                                <p className="text-xs text-sc-gold font-mono mt-0.5">{item.manufacturer}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-sm font-bold text-white">{item.price} aUEC</span>
                                                <span className="text-[10px] text-white/40 font-mono">SIZE {item.size}</span>
                                            </div>
                                        </div>

                                        <div className="my-2 h-px bg-white/10" />

                                        <div className="grid grid-cols-2 gap-2 text-xs text-white/70 font-mono">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldAlert className="w-3 h-3 text-red-400" />
                                                <span>{item.damage} DMG</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Zap className="w-3 h-3 text-yellow-400" />
                                                <span>{item.fireRate > 0 ? `${item.fireRate} RPM` : 'SINGLE'}</span>
                                            </div>
                                        </div>

                                        {/* Equip Button (Hidden until hover) */}
                                        <div className="absolute inset-0 bg-sc-blue/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="font-bold text-black flex items-center gap-2">
                                                <ShoppingCart className="w-4 h-4" />
                                                EQUIP
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Stats */}
                        <div className="p-3 bg-white/5 border-t border-white/10 text-[10px] text-white/40 font-mono flex justify-between">
                            <span>POWER: OK</span>
                            <span>COOLING: OK</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
