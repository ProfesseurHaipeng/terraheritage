/**
 * 内容标记点 —— DESIGN.md §4 Markers。
 * 接收 {id, kind, position:[lat,lng]}[] props,三类形状:
 * 植物=圆点(sphere,--eco)/ 文化=菱形(octahedron,--accent)/ 医学=方块(box,--medicine)。
 * 点击回传 id;自身处理拾取并 stopPropagation,不穿透到海洋球。
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { latLngToVec3 } from '@/lib/geo';

export type MarkerKind = 'plant' | 'culture' | 'medicine';

export interface MarkerSpec {
  id: string;
  kind: MarkerKind;
  /** [纬度, 经度] */
  position: [number, number];
}

/** 三类标记的图层色(DESIGN.md §3.1) */
const KIND_COLOR: Record<MarkerKind, string> = {
  plant: '#7BA889',
  culture: '#C9A15F',
  medicine: '#B0705A',
};

/** 标记半径(世界单位,R=1) */
const SIZE = 0.012;

interface MarkersProps {
  markers: MarkerSpec[];
  onSelect?: (id: string) => void;
}

export default function Markers({ markers, onSelect }: MarkersProps) {
  // 三类共享几何体,避免每个标记各建一份
  const geoms = useMemo(
    () => ({
      plant: new THREE.SphereGeometry(SIZE, 12, 12),
      culture: new THREE.OctahedronGeometry(SIZE * 1.2),
      medicine: new THREE.BoxGeometry(SIZE * 1.6, SIZE * 1.6, SIZE * 1.6),
    }),
    [],
  );

  function handleClick(e: ThreeEvent<MouseEvent>, id: string) {
    if (e.delta > 4) return; // 拖拽后的抬起不算点击
    e.stopPropagation();
    onSelect?.(id);
  }

  return (
    <group>
      {markers.map((m) => {
        const pos = latLngToVec3(m.position[0], m.position[1], 1.015);
        return (
          <mesh
            // 复合键:kind + id + 点位(同一植物/民族可有多个分布点,裸 id 会撞键)
            key={`${m.kind}:${m.id}:${m.position[0]},${m.position[1]}`}
            geometry={geoms[m.kind]}
            position={pos}
            // 让菱形/方块沿法线朝外
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            onClick={(e) => handleClick(e, m.id)}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = '';
            }}
          >
            <meshBasicMaterial color={KIND_COLOR[m.kind]} />
          </mesh>
        );
      })}
    </group>
  );
}
