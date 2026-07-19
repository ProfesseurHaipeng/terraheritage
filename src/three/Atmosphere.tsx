/**
 * 大气光晕 —— 背面壳 + 加法混合(DESIGN.md §4,色值 --atmo #4C7FB8)。
 * 经典光晕 shader:视线方向与法线越接近垂直,边缘发光越强。
 */
import { useMemo } from 'react';
import * as THREE from 'three';

const VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    // 视图空间法线,供 fragment 计算视线夹角
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    // 背面壳:法线朝外,与视线(0,0,1)垂直处最亮
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(uColor, 1.0) * intensity;
  }
`;

export default function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uColor: { value: new THREE.Color('#4C7FB8') } },
        side: THREE.BackSide, // 只渲染背面壳,形成外圈光晕
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh material={material} scale={1.18} raycast={() => null}>
      <sphereGeometry args={[1, 48, 48]} />
    </mesh>
  );
}
