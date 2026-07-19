/**
 * 云层 —— 半径 1.008 的半透明球,慢速自转(约 0.004 rad/s)。
 * 纹理 earth_clouds_1024.png:equirect + alpha,与地表同源的
 * SphereGeometry UV/经度 90° 偏差,用相同的 rotation.y = -π/2 修正
 * (推导与验证见 Earth.tsx 顶部注释 / scripts/verify-texture-uv.mjs)。
 * raycast 禁用,事件穿透到海洋球;节能档由 GlobeCanvas 直接不挂载。
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

/** 自转角速度(rad/s):useFrame 的 delta 单位为秒 */
const SPIN_SPEED = 0.004;
/** 纹理方向修正:与 Earth 海洋球一致(经度偏差 90°) */
const TEXTURE_ROTATION_Y = -Math.PI / 2;
/** 云层整体不透明度 */
const CLOUD_OPACITY = 0.35;

const noRaycast = () => null;

export default function Clouds() {
  const meshRef = useRef<THREE.Mesh>(null);
  const map = useLoader(THREE.TextureLoader, '/textures/earth_clouds_1024.png');

  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
  }, [map]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += SPIN_SPEED * delta;
  });

  return (
    // renderOrder 1:在国家填充(0)之后渲染,叠加在填充层之上
    <mesh
      ref={meshRef}
      rotation-y={TEXTURE_ROTATION_Y}
      raycast={noRaycast}
      renderOrder={1}
    >
      <sphereGeometry args={[1.008, 64, 64]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={CLOUD_OPACITY}
        depthWrite={false}
      />
    </mesh>
  );
}
