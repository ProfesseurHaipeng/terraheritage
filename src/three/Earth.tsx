/**
 * 海洋球体 + 拾取入口 —— DESIGN.md §4。
 * 地表:NASA equirect 纹理(earth_atmos_2048.jpg)+ 自定义 shader:
 * 采样纹理为基色,边缘 fresnel 向深色系收敛(limb 压暗,融入大气),
 * 定向日光高光以 earth_specular_2048.jpg 为海面掩码(节能档关闭)。
 * 拾取:海洋球接收 pointermove(60ms 节流)/ click / dblclick,
 * 交点 → lat/lng → point-in-polygon → store 悬停/选中;双击请求飞行。
 * 国家填充/边界/大气均禁用 raycast,事件自然穿透到海洋球。
 */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import geoData from '@/data/geo/countries.geo.json';
import type { GeoFeature } from '@/types';
import { pointInFeature, vec3ToLatLng } from '@/lib/geo';
import { useAppStore } from '@/stores/appStore';
import type { QualitySpec } from '@/lib/quality';
import CountryFills from './CountryFills';
import CountryBorders from './CountryBorders';
import Atmosphere from './Atmosphere';

/**
 * 纹理方向修正(数值验证见 scripts/verify-texture-uv.mjs):
 * three 的 SphereGeometry 顶点公式为
 *   x = -cos(2πu)·sin(πv), z = sin(2πu)·sin(πv),  uv = (u, 1 - v);
 * 本项目 latLngToVec3 约定经度 0° → +z、东经 90° → +x。
 * 代入得 u = (lng + 90°) / 360°,而 NASA equirect 纹理的
 * u_tex = (lng + 180°) / 360°,两者恒定相差 90°。
 * 因此把 mesh 绕 y 轴旋转 -π/2:旋转后纹理像素正好落在与其经纬一致的
 * 世界方向上(拾取用世界坐标 e.point,逻辑不受影响)。
 * 等价做法是 texture.offset.x = +0.25(仅内置材质生效;自定义
 * ShaderMaterial 需在 shader 里自行 fract,且会在 180° 经线引入接缝),
 * 故选 rotation 方案。
 */
const TEXTURE_ROTATION_Y = -Math.PI / 2;

const OCEAN_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const OCEAN_FRAG = /* glsl */ `
  uniform sampler2D uMap;     // 地表纹理(equirect,sRGB)
  uniform sampler2D uSpecMap; // 海面高光掩码(海洋≈1,陆地≈0,线性)
  uniform vec3 uDeep;
  uniform vec3 uSunDir;
  uniform float uSpecular; // 0/1:节能档关闭日光高光
  uniform float uDim;      // 整体压暗系数,贴合 #05080F 深色主题
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    vec3 color = texture2D(uMap, vUv).rgb * uDim;
    // limb 压暗:fresnel 边缘向深海色收敛一点,与大气光晕衔接
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.2);
    color = mix(color, uDeep, fresnel * 0.55);
    // 定向日光高光:高 shininess + 低强度,海面掩码限制在海洋区域
    if (uSpecular > 0.5) {
      float mask = texture2D(uSpecMap, vUv).r;
      vec3 r = reflect(-normalize(uSunDir), n);
      float spec = pow(max(dot(r, v), 0.0), 220.0) * 0.10 * mask;
      color += vec3(spec);
    }
    gl_FragColor = vec4(color, 1.0);
    // 自定义 ShaderMaterial 需手动接入 tonemapping / 输出色彩空间
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
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
  const gl = useThree((s) => s.gl);

  // NASA 公域纹理:地表(sRGB)+ 海面高光掩码(线性数据)
  const [map, specMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_atmos_2048.jpg',
    '/textures/earth_specular_2048.jpg',
  ]);

  const textures = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    map.needsUpdate = true;
    specMap.anisotropy = map.anisotropy; // 掩码保持线性色彩空间
    specMap.needsUpdate = true;
    return { map, specMap };
  }, [map, specMap, gl]);

  const oceanMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: OCEAN_VERT,
        fragmentShader: OCEAN_FRAG,
        uniforms: {
          uMap: { value: textures.map },
          uSpecMap: { value: textures.specMap },
          uDeep: { value: new THREE.Color('#0D1B2E') },
          uSunDir: { value: new THREE.Vector3(1.2, 0.5, 0.9).normalize() },
          uSpecular: { value: spec.oceanSpecular ? 1 : 0 },
          uDim: { value: 0.9 },
        },
      }),
    [spec.oceanSpecular, textures],
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
      {/* 海洋球:唯一的拾取面;rotation 为纹理方向修正(见文件顶部推导),
          拾取使用世界坐标 e.point,不受影响 */}
      <mesh
        material={oceanMaterial}
        rotation-y={TEXTURE_ROTATION_Y}
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
