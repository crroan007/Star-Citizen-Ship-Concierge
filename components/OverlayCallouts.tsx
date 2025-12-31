"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface OverlayCalloutsProps {
    hardpoints: THREE.Object3D[];
    isMovingRef: React.MutableRefObject<boolean>;
}

interface ScreenPoint {
    id: string;
    x: number;
    y: number;
    safeY: number;
    label: string;
    type: string;
    side: 'left' | 'right';
    destX: number;
}

export default function OverlayCallouts({ hardpoints, isMovingRef, onHardpointClick }: OverlayCalloutsProps & { onHardpointClick?: (hp: any) => void }) {
    const { camera, size } = useThree();
    const [screenPoints, setScreenPoints] = useState<ScreenPoint[]>([]);

    // We use a ref to manipulate the opacity DOM element directly
    const opacityContainerRef = useRef<HTMLDivElement>(null);

    // Color map matching HardpointMarker
    const TYPE_COLORS: Record<string, string> = {
        'weapon': '#ff6600',
        'missile': '#00e5ff',
        'turret': '#ffcc00',
        'utility': '#999999'
    };

    const lastCameraQuat = useRef(new THREE.Quaternion());
    const lastCameraPos = useRef(new THREE.Vector3());

    useFrame(() => {
        // 1. Hande Visibility (Opacity) via Ref
        if (opacityContainerRef.current) {
            const isMoving = isMovingRef.current;
            const targetOpacity = isMoving ? "0" : "1";

            // Pointer events toggle: Only active when NOT moving and visible
            const targetPointerEvents = isMoving ? "none" : "auto";

            if (opacityContainerRef.current.style.opacity !== targetOpacity) {
                opacityContainerRef.current.style.opacity = targetOpacity;
                opacityContainerRef.current.style.pointerEvents = targetPointerEvents;
            }
        }

        if (isMovingRef.current) return;

        if (
            camera.quaternion.equals(lastCameraQuat.current) &&
            camera.position.equals(lastCameraPos.current) &&
            hardpoints.length > 0
        ) {
            return;
        }
        lastCameraQuat.current.copy(camera.quaternion);
        lastCameraPos.current.copy(camera.position);

        const width = size.width;
        const height = size.height;
        const centerX = width / 2;

        const projected = hardpoints.map(hp => {
            const pos = new THREE.Vector3();
            hp.getWorldPosition(pos);
            pos.project(camera);

            const x = (pos.x * .5 + .5) * width;
            const y = (pos.y * -.5 + .5) * height;

            return {
                id: hp.uuid,
                x,
                y,
                z: pos.z,
                label: hp.userData.friendlyLabel || "UNKNOWN",
                type: hp.userData.hpType || "weapon",
                originalObj: hp // Pass original object for callback
            };
        }).filter(p => p.z < 1);

        if (projected.length === 0) {
            if (screenPoints.length > 0) setScreenPoints([]);
            return;
        }

        let minX = width, maxX = 0;
        projected.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
        });

        const PADDING = 60;
        const leftAnchor = Math.max(20, minX - PADDING);
        const rightAnchor = Math.min(width - 20, maxX + PADDING);

        const leftPoints: any[] = [];
        const rightPoints: any[] = [];

        projected.forEach(p => {
            const side = p.x < centerX ? 'left' : 'right';
            const item = {
                ...p,
                side,
                destX: side === 'left' ? leftAnchor : rightAnchor,
                safeY: p.y
            };
            if (side === 'left') leftPoints.push(item);
            else rightPoints.push(item);
        });

        const LABEL_HEIGHT = 50;
        const spreadY = (points: any[]) => {
            if (points.length <= 1) return;
            points.sort((a, b) => a.y - b.y);
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                if (curr.safeY < prev.safeY + LABEL_HEIGHT) {
                    curr.safeY = prev.safeY + LABEL_HEIGHT;
                }
            }
        };

        spreadY(leftPoints);
        spreadY(rightPoints);
        setScreenPoints([...leftPoints, ...rightPoints]);
    });

    return (
        <Html fullscreen style={{ pointerEvents: 'none', zIndex: 10 }}>
            <div
                ref={opacityContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    transition: 'opacity 0.2s ease-out',
                    opacity: 1,
                    pointerEvents: 'auto' // Managed by ref in useFrame
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
                >
                    {screenPoints.map((pt) => {
                        const color = TYPE_COLORS[pt.type] || '#ffffff';

                        return (
                            <g
                                key={pt.id}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onHardpointClick && onHardpointClick({
                                    id: pt.id,
                                    label: pt.label,
                                    type: pt.type
                                })}
                            >
                                <circle cx={pt.x} cy={pt.y} r="5" fill="transparent" stroke={color} strokeWidth="2" />
                                <circle cx={pt.x} cy={pt.y} r="2" fill={color} />

                                <line
                                    x1={pt.x} y1={pt.y}
                                    x2={pt.destX} y2={pt.safeY}
                                    stroke={color}
                                    strokeWidth="2"
                                    opacity="0.6"
                                    pointerEvents="none"
                                />

                                <foreignObject
                                    x={pt.side === 'right' ? pt.destX : pt.destX - 220}
                                    y={pt.safeY - 20}
                                    width="220"
                                    height="40"
                                    style={{ overflow: 'visible' }}
                                >
                                    <div className={`
                                        bg-black/80 border border-white/20 backdrop-blur-sm px-3 py-1
                                        text-xs font-mono font-bold text-white whitespace-nowrap
                                        flex items-center gap-2 shadow-lg h-full pointer-events-auto select-none
                                        ${pt.side === 'right' ? 'flex-row rounded-r-md border-l-0' : 'flex-row-reverse text-right rounded-l-md border-r-0'}
                                    `}
                                        style={{
                                            borderColor: color,
                                            borderLeftWidth: pt.side === 'right' ? '4px' : '1px',
                                            borderRightWidth: pt.side === 'left' ? '4px' : '1px'
                                        }}
                                    >
                                        <span style={{ color }} className="text-sm">{pt.type.substr(0, 4).toUpperCase()}</span>
                                        <span className="text-sm truncate">{pt.label}</span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </Html>
    );
}
