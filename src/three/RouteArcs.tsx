/**
 * 历史传播路线弧线 —— DESIGN.md §4 RouteArcs。
 * 接收 path 数组 props,相邻点间生成大圆弧线(顶点上拱),
 * 自定义 shader 实现虚线流动(uOffset 每帧推进),色值 --history #B08D57。
 * 数据侧需自行标注"示意路线 · 历史推测"(UI 层职责)。
 */
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StoryRoute } from '@/types';
import { greatCircleArc, latLngToVec3, R } from '@/lib/geo';

const noRaycast = () => null;

const ARC_VERT = /* glsl */ `
  attribute float lineDistance; // 沿线累计距离(世界单位)
  varying float vDist;
  void main() {
    vDist = lineDistance;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ARC_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOffset;  // 流动相位
  uniform float uDash;
  uniform float uGap;
  uniform float uOpacity;
  varying float vDist;
  void main() {
    float period = uDash + uGap;
    // 虚线:相位落在 gap 区段则丢弃
    if (mod(vDist + uOffset, period) > uDash) discard;
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

interface ArcData {
  key: string;
  line: THREE.Line;
}

/** 单条路线:path 相邻点逐段大圆弧拼接为一条折线 */
function buildArc(route: StoryRoute, index: number): ArcData | null {
  if (route.path.length < 2) return null;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < route.path.length - 1; i++) {
    const a = route.path[i];
    const b = route.path[i + 1];
    // 弧高随角距增大( clamps 上限避免跨半球时过高)
    const va = latLngToVec3(a[0], a[1]);
    const vb = latLngToVec3(b[0], b[1]);
    const angle = va.angleTo(vb);
    const height = Math.min(0.22, 0.04 + angle * 0.15);
    const seg = greatCircleArc(a, b, R, 0.012, height, 48);
    if (i > 0) seg.shift(); // 去掉段首重复点
    points.push(...seg);
  }

  const positions = new Float32Array(points.length * 3);
  const distances = new Float32Array(points.length);
  let acc = 0;
  points.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    if (i > 0) acc += p.distanceTo(points[i - 1]);
    distances[i] = acc;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('lineDistance', new THREE.BufferAttribute(distances, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: ARC_VERT,
    fragmentShader: ARC_FRAG,
    uniforms: {
      uColor: { value: new THREE.Color('#B08D57') },
      uOffset: { value: index * 0.13 }, // 各条路线错相
      uDash: { value: 0.05 },
      uGap: { value: 0.035 },
      uOpacity: { value: 0.9 },
    },
    transparent: true,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  line.raycast = noRaycast as unknown as THREE.Line['raycast']; // 不参与拾取
  return { key: route.id, line };
}

interface RouteArcsProps {
  routes: StoryRoute[];
  /** 图层可见性开关(淡入淡出由 UI 层负责,这里直接挂载/卸载) */
  visible?: boolean;
}

export default function RouteArcs({ routes, visible = true }: RouteArcsProps) {
  const arcs = useMemo(
    () =>
      routes
        .map((r, i) => buildArc(r, i))
        .filter((a): a is ArcData => a !== null),
    [routes],
  );
  const arcsRef = useRef(arcs);
  arcsRef.current = arcs;

  // 卸载/重建时释放 GPU 资源
  useEffect(() => {
    return () => {
      for (const a of arcs) {
        a.line.geometry.dispose();
        (a.line.material as THREE.ShaderMaterial).dispose();
      }
    };
  }, [arcs]);

  // 虚线流动
  useFrame((_, dt) => {
    for (const a of arcsRef.current) {
      const u = (a.line.material as THREE.ShaderMaterial).uniforms.uOffset;
      u.value = (u.value as number) - dt * 0.06;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {arcs.map((a) => (
        <primitive key={a.key} object={a.line} />
      ))}
    </group>
  );
}
