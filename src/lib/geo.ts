/**
 * 球面几何工具 —— DESIGN.md §4.1。
 * 约定:地球半径 R=1,y 轴为北极方向;经度 0° 朝 +z,东经 90° 朝 +x。
 * 全部为纯函数,可独立测试(countryCentroid 除外,它读取内置 GeoJSON)。
 */
import * as THREE from 'three';
import geoData from '@/data/geo/countries.geo.json';
import type { GeoFeature } from '@/types';

export const R = 1;

const DEG = Math.PI / 180;

/** [纬度, 经度] 经纬度对(度) */
export type LatLng = [number, number];

/** 经纬度 → 单位球面三维坐标 */
export function latLngToVec3(lat: number, lng: number, radius: number = R): THREE.Vector3 {
  const phi = lat * DEG; // 纬度(自赤道起)
  const theta = lng * DEG; // 经度
  const cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.sin(theta),
    radius * Math.sin(phi),
    radius * cosPhi * Math.cos(theta),
  );
}

/** 三维坐标 → [纬度, 经度] */
export function vec3ToLatLng(v: THREE.Vector3): LatLng {
  const r = v.length();
  const lat = Math.asin(THREE.MathUtils.clamp(v.y / r, -1, 1)) / DEG;
  const lng = Math.atan2(v.x, v.z) / DEG;
  return [lat, lng];
}

/** 把经度归一化到 (ref-180, ref+180] 区间,用于跨 180° 环的展开 */
export function unwrapLng(lng: number, ref: number): number {
  let l = lng;
  while (l - ref > 180) l -= 360;
  while (l - ref <= -180) l += 360;
  return l;
}

/** 环的经度中心(先归一到首点附近再取均值,避免跨 180° 时中心跳到对侧) */
export function ringCenterLng(ring: LatLng[]): number {
  if (ring.length === 0) return 0;
  const ref = ring[0][1];
  let sum = 0;
  for (const [, lng] of ring) sum += unwrapLng(lng, ref);
  return ref + sum / ring.length;
}

/** 跨 180° 展开:返回经度已相对环心展开的环副本 */
export function unwrapRing(ring: LatLng[]): LatLng[] {
  const c = ringCenterLng(ring);
  return ring.map(([lat, lng]) => [lat, unwrapLng(lng, c)] as LatLng);
}

/**
 * 等距方位投影:以 (lat0, lng0) 为原点把球面点投到平面(单位:弧度)。
 * 用于在小区域内做无撕裂的三角化。
 */
function azimuthalProject(lat: number, lng: number, lat0: number, lng0: number): [number, number] {
  const phi = lat * DEG;
  const phi0 = lat0 * DEG;
  const dLambda = (lng - lng0) * DEG;
  // 等距方位投影公式
  const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLambda);
  const c = Math.acos(THREE.MathUtils.clamp(cosc, -1, 1));
  const k = c === 0 ? 1 : c / Math.sin(c);
  const x = k * Math.cos(phi) * Math.sin(dLambda);
  const y = k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLambda));
  return [x, y];
}

/**
 * 球面填充三角化:
 * 1) 所有环相对整体经度中心展开(处理跨 180°);
 * 2) 以环心做等距方位投影到平面;
 * 3) THREE.ShapeUtils.triangulateShape(earcut)三角化(外环 + 洞);
 * 4) 弦塌陷修正:earcut 的边是割线直弦,大国长边(10°+)的弦会沉入
 *    半径 1.0 的海洋球之下(10° 弦中点下陷约 0.0038R,填充半径仅 1.001)。
 *    对每个三角形递归细分——最长边角距 > 2.5° 就在其中点(球面插值后
 *    归一化回填充半径)处拆分,直到所有边 ≤ 2.5°;
 * 5) 逐三角形朝向校验(法线 · 质心径向 > 0 才朝外);
 * 6) 返回按半径重投影到球面的顶点数组与索引(供 BufferGeometry)。
 */

/** 细分阈值:球面边最大角距(度) */
const MAX_EDGE_DEG = 2.5;

export function triangulateSphericalPolygon(
  polygon: LatLng[][], // [外环, ...洞]
  radius: number,
): { positions: Float32Array; indices: Uint32Array } {
  const outer = polygon[0];
  if (!outer || outer.length < 3) {
    return { positions: new Float32Array(0), indices: new Uint32Array(0) };
  }
  const cLng = ringCenterLng(outer);
  // 纬度中心取外环均值
  const cLat = outer.reduce((s, [lat]) => s + lat, 0) / outer.length;

  const projectedRings = polygon.map((ring) =>
    ring.map(([lat, lng]) => azimuthalProject(lat, unwrapLng(lng, cLng), cLat, cLng)),
  );
  const contour = projectedRings[0].map(([x, y]) => new THREE.Vector2(x, y));
  const holes = projectedRings.slice(1).map((r) => r.map(([x, y]) => new THREE.Vector2(x, y)));

  const rawTris = THREE.ShapeUtils.triangulateShape(contour, holes);

  // ---- 弦塌陷修正:递归细分长边 ----
  // 动态顶点表(初始顶点 = 外环 + 各洞,与 triangulateShape 的输入顺序一致)
  const verts: THREE.Vector3[] = polygon
    .flat()
    .map(([lat, lng]) => latLngToVec3(lat, lng, radius));
  // 边中点缓存(key 为无序索引对),相邻三角形共享中点,避免 T 型裂缝
  const midCache = new Map<string, number>();
  const maxEdgeRad = MAX_EDGE_DEG * DEG;

  /** 两端点的角距(弧度) */
  function edgeAngle(i: number, j: number): number {
    const d = verts[i].dot(verts[j]) / (radius * radius);
    return Math.acos(THREE.MathUtils.clamp(d, -1, 1));
  }

  /** 边中点:球面插值后归一化回填充半径;带缓存共享 */
  function midpoint(i: number, j: number): number {
    const key = i < j ? `${i}:${j}` : `${j}:${i}`;
    const hit = midCache.get(key);
    if (hit !== undefined) return hit;
    const m = slerp(
      verts[i].clone().normalize(),
      verts[j].clone().normalize(),
      0.5,
    ).multiplyScalar(radius);
    verts.push(m);
    midCache.set(key, verts.length - 1);
    return verts.length - 1;
  }

  const finalTris: [number, number, number][] = [];
  const stack: [number, number, number][] = rawTris.map((t) => [t[0], t[1], t[2]]);
  while (stack.length > 0) {
    const t = stack.pop()!;
    const e01 = edgeAngle(t[0], t[1]);
    const e12 = edgeAngle(t[1], t[2]);
    const e20 = edgeAngle(t[2], t[0]);
    const max = Math.max(e01, e12, e20);
    if (max <= maxEdgeRad) {
      finalTris.push(t);
      continue;
    }
    // 在最长边中点处拆分(对顶点 + 中点 组成两个新三角形)
    if (max === e01) {
      const m = midpoint(t[0], t[1]);
      stack.push([t[0], m, t[2]], [m, t[1], t[2]]);
    } else if (max === e12) {
      const m = midpoint(t[1], t[2]);
      stack.push([t[0], t[1], m], [t[0], m, t[2]]);
    } else {
      const m = midpoint(t[2], t[0]);
      stack.push([t[0], t[1], m], [t[1], t[2], m]);
    }
  }

  // ---- 重建顶点数组 ----
  const positions = new Float32Array(verts.length * 3);
  verts.forEach((v, i) => {
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  });

  // ---- 逐三角形朝向校验 ----
  // 细分与 earcut 都可能给出不一致的环绕方向;法线 · 质心径向 > 0 才朝外,否则交换两个索引。
  const indices = new Uint32Array(finalTris.length * 3);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const radial = new THREE.Vector3();
  finalTris.forEach((tri, i) => {
    let [i0, i1, i2] = tri;
    a.fromArray(positions, i0 * 3);
    b.fromArray(positions, i1 * 3);
    c.fromArray(positions, i2 * 3);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    normal.crossVectors(ab, ac);
    radial.addVectors(a, b).add(c).normalize(); // 三角形质心径向
    if (normal.dot(radial) < 0) {
      const tmp = i1;
      i1 = i2;
      i2 = tmp; // 翻转朝向
    }
    indices[i * 3] = i0;
    indices[i * 3 + 1] = i1;
    indices[i * 3 + 2] = i2;
  });
  return { positions, indices };
}

/** 平面射线法:点是否在单个环内(环需已相对测试点经度展开) */
export function pointInRing(lat: number, lng: number, ring: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [latI, lngI] = ring[i];
    const [latJ, lngJ] = ring[j];
    // 标准射线法:统计向右发射线与边的交点奇偶性
    if (
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/** 环包围盒(经度已展开) */
export function ringBBox(ring: LatLng[]): [number, number, number, number] {
  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;
  for (const [lat, lng] of ring) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return [minLat, minLng, maxLat, maxLng];
}

/** 点是否在单个 Polygon(外环内且不在任何洞内) */
export function pointInPolygon(lat: number, lng: number, polygon: LatLng[][]): boolean {
  const outer = unwrapRing(polygon[0]);
  // 包围盒粗筛
  const [minLat, minLng, maxLat, maxLng] = ringBBox(outer);
  const uLng = unwrapLng(lng, (minLng + maxLng) / 2);
  if (lat < minLat || lat > maxLat || uLng < minLng || uLng > maxLng) return false;
  const uRing = polygon[0].map(([la, ln]) => [la, unwrapLng(ln, uLng)] as LatLng);
  if (!pointInRing(lat, uLng, uRing)) return false;
  // 洞细判
  for (const hole of polygon.slice(1)) {
    const uHole = hole.map(([la, ln]) => [la, unwrapLng(ln, uLng)] as LatLng);
    if (pointInRing(lat, uLng, uHole)) return false;
  }
  return true;
}

/** GeoJSON 坐标环([lng, lat])→ 内部 LatLng([lat, lng])环 */
export function geoToLatLngRing(ring: number[][]): LatLng[] {
  return ring.map(([lng, lat]) => [lat, lng] as LatLng);
}

/** GeoJSON Feature(Polygon/MultiPolygon)的点包含判断(输入坐标为 GeoJSON [lng,lat]) */
export function pointInFeature(lat: number, lng: number, feature: GeoFeature): boolean {
  const g = feature.geometry;
  if (g.type === 'Polygon') {
    return pointInPolygon(lat, lng, g.coordinates.map(geoToLatLngRing));
  }
  return g.coordinates.some((poly) => pointInPolygon(lat, lng, poly.map(geoToLatLngRing)));
}

/** 球面线性插值(slerp):a、b 为单位向量,t∈[0,1] */
export function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a.clone(); // 方向几乎相同
  const sinOmega = Math.sin(omega);
  const ka = Math.sin((1 - t) * omega) / sinOmega;
  const kb = Math.sin(t * omega) / sinOmega;
  return a.clone().multiplyScalar(ka).add(b.clone().multiplyScalar(kb));
}

/** easeInOutCubic(DESIGN.md §3.3 镜头飞行缓动) */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 大圆弧线:相邻两点间 slerp 插值,顶点沿法线抬高 base + sin(πt)*height */
export function greatCircleArc(
  a: LatLng,
  b: LatLng,
  radius: number,
  base: number,
  height: number,
  segments = 48,
): THREE.Vector3[] {
  const va = latLngToVec3(a[0], a[1]).normalize();
  const vb = latLngToVec3(b[0], b[1]).normalize();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const dir = slerp(va, vb, t);
    pts.push(dir.multiplyScalar(radius + base + Math.sin(Math.PI * t) * height));
  }
  return pts;
}

/** 国家近似质心:所有外环顶点经纬均值(供 F 键/搜索聚焦飞行) */
export function countryCentroid(iso: string): [number, number] | null {
  const f = geoData.features.find((ft) => ft.properties.id === iso);
  if (!f) return null;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let latSum = 0;
  let lngSum = 0;
  let n = 0;
  for (const poly of polys) {
    const ring = geoToLatLngRing(poly[0]);
    for (const [lat, lng] of ring) {
      latSum += lat;
      lngSum += lng;
      n++;
    }
  }
  return n === 0 ? null : [latSum / n, lngSum / n];
}
