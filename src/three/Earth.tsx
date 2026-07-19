/**
 * 海洋球体 + 拾取入口 —— DESIGN.md §4。
 * 自定义 shader:底色 --ocean #0D1B2E → --ocean-glow #1B3A5C 的 fresnel 渐变,
 * 加一个定向日光高光(节能档关闭)。
 * 拾取:海洋球接收 pointermove(60ms 节流)/ click / dblclick,
 * 交点 → lat/lng → point-in-polygon → store 悬停/选中;双击请求飞行。
 * 国家填充/边界/大气均禁用 raycast,事件自然穿透到海洋球。
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import geoData from '@/data/geo/countries.geo.json';
import type { GeoFeature } from '@/types';
import { pointInFeature, vec3ToLatLng } from '@/lib/geo';
import { useAppStore } from '@/stores/appStore';
import type { QualitySpec } from '@/lib/quality';
import CountryFills from './CountryFills';
import CountryBorders from './CountryBorders';
import Atmosphere from './Atmosphere';

const OCEAN_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const OCEAN_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uGlow;
  uniform vec3 uSunDir;
  uniform float uSpecular; // 0/1:节能档关闭日光高光
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    // fresnel:边缘向亮蓝渐变
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.2);
    vec3 color = mix(uDeep, uGlow, fresnel);
    // 定向日光高光:高 shininess + 低强度,呈现远处日照在海面的小而柔的淡亮斑
    if (uSpecular > 0.5) {
      vec3 r = reflect(-normalize(uSunDir), n);
      float spec = pow(max(dot(r, v), 0.0), 220.0) * 0.10;
      color += vec3(spec);
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** 在全部国家里找包含 (lat,lng) 的 feature(包围盒粗筛 + 射线法细判) */
function findFeatureAt(lat: number, lng: number): GeoFeature | null {
  for (const f of geoData.features) {
    if (pointInFeature(lat, lng, f)) return f;
  }
  return null;
}

interface EarthProps {
  spec: QualitySpec;
}

export default function Earth({ spec }: EarthProps) {
  const lastPickAt = useRef(0);

  const oceanMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: OCEAN_VERT,
        fragmentShader: OCEAN_FRAG,
        uniforms: {
          uDeep: { value: new THREE.Color('#0D1B2E') },
          uGlow: { value: new THREE.Color('#1B3A5C') },
          uSunDir: { value: new THREE.Vector3(1.2, 0.5, 0.9).normalize() },
          uSpecular: { value: spec.oceanSpecular ? 1 : 0 },
        },
      }),
    [spec.oceanSpecular],
  );

  /** 交点 → 国家;同步更新悬停态与光标 */
  function pickAtPoint(point: THREE.Vector3): GeoFeature | null {
    const [lat, lng] = vec3ToLatLng(point);
    const feature = findFeatureAt(lat, lng);
    useAppStore.getState().setHoveredIso(feature ? feature.properties.id : null);
    document.body.style.cursor = feature ? 'pointer' : '';
    return feature;
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    const now = performance.now();
    if (now - lastPickAt.current < 60) return; // 60ms 节流
    lastPickAt.current = now;
    pickAtPoint(e.point);
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    if (e.delta > 4) return; // 拖拽后的抬起不算点击
    e.stopPropagation();
    const feature = pickAtPoint(e.point);
    useAppStore.getState().selectCountry(feature ? feature.properties.id : null);
  }

  function handleDoubleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const [lat, lng] = vec3ToLatLng(e.point);
    const feature = findFeatureAt(lat, lng);
    if (!feature) return;
    useAppStore.getState().selectCountry(feature.properties.id);
    useAppStore.getState().flyTo(lat, lng); // 双击 → 飞近聚焦
  }

  return (
    <group>
      {/* 海洋球:唯一的拾取面 */}
      <mesh
        material={oceanMaterial}
        onPointerMove={handlePointerMove}
        onPointerOut={() => {
          useAppStore.getState().setHoveredIso(null);
          document.body.style.cursor = '';
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* 海洋球半径 0.998:略低于填充半径 1.001,与弦细分一起保证填充不被海洋盖住 */}
        <sphereGeometry args={[0.998, 96, 96]} />
      </mesh>

      {/* 国家填充 / 边界 / 大气:只渲染;各自 mesh/line 上禁用 raycast,不参与拾取 */}
      <CountryFills simplify={spec.simplifyFills} />
      <CountryBorders />
      <Atmosphere />
    </group>
  );
}
