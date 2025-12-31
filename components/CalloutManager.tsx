"use client";

import { useXR } from "@react-three/xr";
import * as THREE from "three";
import OverlayCallouts from "./OverlayCallouts";
import SpatialCallouts from "./SpatialCallouts";

interface CalloutManagerProps {
    hardpoints: THREE.Object3D[];
    isMovingRef: React.MutableRefObject<boolean>;
    onInteract?: (hp: any) => void;
}

export default function CalloutManager({ hardpoints, isMovingRef, onInteract }: CalloutManagerProps) {
    const { isPresenting } = useXR();

    if (isPresenting) {
        // In VR, we show 3D spatial callouts
        return <SpatialCallouts hardpoints={hardpoints} />;
    } else {
        // On Desktop, we show the intelligent 2D overlay
        return <OverlayCallouts
            hardpoints={hardpoints}
            isMovingRef={isMovingRef}
            onHardpointClick={onInteract}
        />;
    }
}
