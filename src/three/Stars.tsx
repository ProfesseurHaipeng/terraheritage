/**
 * 程序化星空 —— DESIGN.md §4。
 * 球壳分布(半径 30–90),数量随画质档:高 6000 / 平衡 3000 / 节能 1500。
 * 减少动态时保持静态;否则做极轻微的整体亮度呼吸。
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '@/stores/appStore';

interface StarsProps {
  count: number;
}

export default function Stars({ count }: StarsProps) {
  const matRef = useRef<THREE.PointsMaterial>(null);
  const reducedMotion = useAppStore((s) => s.reducedMotion);

  // 球壳均匀随机分布:高斯方向归一化 × 随机半径
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.set(
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2),
      );
      if (v.lengthSq() < 1e-6) v.set(0, 1, 0);
      v.normalize().multiplyScalar(30 + Math.random() * 60);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, [count]);

  // 微闪:整体透明度慢速呼吸(减少动态时跳过)
  useFrame(({ clock }) => {
    if (reducedMotion || !matRef.current) return;
    matRef.current.opacity = 0.72 + Math.sin(clock.elapsedTime * 0.6) * 0.1;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#EDE7D6"
        size={0.16}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}
