/**
 * 国家边界线 —— DESIGN.md §4。
 * 全部国家边界合并为一个 LineSegments(米白 --paper 18% 透明度),一次 draw call;
 * 悬停/选中国家单独用 --accent #C9A15F 加亮描边。
 * 与填充共用跨 180° 展开逻辑(经度相对环心展开,见 lib/geo.ts)。
 */
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import geoData from '@/data/geo/countries.geo.json';
import type { GeoFeature } from '@/types';
import { geoToLatLngRing, latLngToVec3, unwrapRing, type LatLng } from '@/lib/geo';
import { useAppStore } from '@/stores/appStore';

/** 边界线半径:略高于填充,防止被填充盖住 */
const BORDER_RADIUS = 1.0025;

const noRaycast = () => null;

/** 已展开环 → 球面线顶点数组 */
function ringToVec3s(ring: LatLng[]): THREE.Vector3[] {
  return ring.map(([lat, lng]) => latLngToVec3(lat, lng, BORDER_RADIUS));
}

/** 一个 feature 的全部环(GeoJSON 坐标,统一 Polygon/MultiPolygon) */
function ringsOf(f: GeoFeature): number[][][] {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.flat();
}

export default function CountryBorders() {
  const hoveredIso = useAppStore((s) => s.hoveredIso);
  const selectedIso = useAppStore((s) => s.selectedCountryIso);
  const bordersOn = useAppStore((s) => s.layers.borders);

  // 全部边界合并为线段对,useMemo 一次构建
  const baseGeometry = useMemo(() => {
    const pts: number[] = [];
    for (const f of geoData.features) {
      for (const raw of ringsOf(f)) {
        const ring = ringToVec3s(unwrapRing(geoToLatLngRing(raw)));
        for (let i = 0; i < ring.length; i++) {
          const a = ring[i];
          const b = ring[(i + 1) % ring.length]; // 闭合
          pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  useEffect(() => () => baseGeometry.dispose(), [baseGeometry]);

  // 悬停/选中国的高亮描边几何(小国一套环,缓存到 Map)
  const highlightGeometry = useMemo(() => {
    const iso = selectedIso ?? hoveredIso;
    if (!iso) return null;
    const f = geoData.features.find((ft) => ft.properties.id === iso);
    if (!f) return null;
    const pts: number[] = [];
    for (const raw of ringsOf(f)) {
      const ring = ringToVec3s(unwrapRing(geoToLatLngRing(raw)));
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, [hoveredIso, selectedIso]);

  useEffect(() => () => highlightGeometry?.dispose(), [highlightGeometry]);

  // 图层开关:隐藏全部边界(含高亮)
  if (!bordersOn) return null;

  return (
    <group>
      {/* 基底边界:米白 18% */}
      <lineSegments geometry={baseGeometry} raycast={noRaycast}>
        <lineBasicMaterial color="#EDE7D6" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
      {/* 悬停/选中加亮:药草金;选中比悬停更亮 */}
      {highlightGeometry && (
        <lineSegments geometry={highlightGeometry} raycast={noRaycast}>
          <lineBasicMaterial
            color="#C9A15F"
            transparent
            opacity={selectedIso ? 0.95 : 0.7}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}
