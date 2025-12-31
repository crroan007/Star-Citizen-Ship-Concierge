"use client";

import { useXR } from "@react-three/xr";
import * as THREE from "three";
import OverlayCallouts from "./OverlayCallouts";
import SpatialCallouts from "./SpatialCallouts";

interface CalloutManagerProps {
    hardpoints: THREE.Object3D[];
    isMovingRef: React.MutableRefObject<boolean>;
}

export default function CalloutManager({ hardpoints, isMovingRef }: CalloutManagerProps) {
    const { isPresenting } = useXR();

    if (isPresenting) {
        // In VR, we show 3D spatial callouts
        return <SpatialCallouts hardpoints={hardpoints} />;
    } else {
        // On Desktop, we show the intelligent 2D overlay
        // We pass the ref so it can poll the moving state frame-by-frame
        return <OverlayCallouts hardpoints={hardpoints} isMovingRef={isMovingRef} />;
    }
}
