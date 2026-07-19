/**
 * 国家填充 mesh —— DESIGN.md §4.1。
 * 每个 Polygon:跨 180° 展开 → 等距方位投影 → earcut 三角化 → 重投影回
 * 半径 1.001 的球面 BufferGeometry(useMemo 缓存,选中/月份变化不重建)。
 * 调色:纬度带基色(低纬偏绿 / 中纬基底 / 高纬岩灰),季节调制由 SeasonLayer
 * 通过 fillRegistry 每帧 lerp 完成。
 * 交互态:选中国整体抬升 0.006R(scale 1.006);有选中时其他国家透明度降至 0.55。
 */
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import geoData from '@/data/geo/countries.geo.json';
import type { GeoFeature } from '@/types';
import { geoToLatLngRing, triangulateSphericalPolygon } from '@/lib/geo';
import { useAppStore } from '@/stores/appStore';
import { registerFill, unregisterFill } from './fillRegistry';

/** 填充半径:略高于海洋球,避免 z-fighting */
export const FILL_RADIUS = 1.001;
/** 选中国家沿法线抬升量(DESIGN.md §3.3:+0.006R) */
const SELECTED_LIFT = 1.006;

const noRaycast = () => null;

interface FillEntry {
  /** `${iso}:${polygonIndex}` */
  key: string;
  iso: string;
  geometry: THREE.BufferGeometry;
  material: THREE.MeshBasicMaterial;
  baseColor: THREE.Color;
  meanLat: number;
}

/** 纬度带基色:低纬偏 land-green,中纬 land-base,高纬偏 land-high */
function baseColorForLat(meanLat: number): THREE.Color {
  const base = new THREE.Color('#22333A');
  const green = new THREE.Color('#3E5C48');
  const high = new THREE.Color('#5A5E63');
  const a = Math.abs(meanLat);
  if (a < 30) return base.lerp(green, 0.55 * (1 - a / 30) + 0.25);
  if (a > 55) return base.lerp(high, Math.min(1, (a - 55) / 20) * 0.6);
  return base;
}

/** 抽稀:节能档隔点采样(数据本身已按 1.2° 抽稀,再稀一档) */
function decimateRing(ring: [number, number][]): [number, number][] {
  if (ring.length < 8) return ring;
  const out = ring.filter((_, i) => i % 2 === 0);
  return out.length >= 3 ? out : ring;
}

/** 单个 Polygon(GeoJSON 坐标)→ 填充 entry;顶点不足返回 null */
function buildEntry(
  key: string,
  iso: string,
  polygon: number[][][],
  simplify: boolean,
): FillEntry | null {
  let rings = polygon.map(geoToLatLngRing);
  if (simplify) rings = rings.map(decimateRing);
  // GeoJSON 环首尾闭合,earcut 前去掉重复尾点,避免退化三角形
  rings = rings.map((r) => {
    const [aLat, aLng] = r[0];
    const [bLat, bLng] = r[r.length - 1];
    return aLat === bLat && aLng === bLng ? r.slice(0, -1) : r;
  });
  const { positions, indices } = triangulateSphericalPolygon(rings, FILL_RADIUS);
  if (positions.length === 0 || indices.length === 0) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // 代表纬度:外环顶点纬度均值(供纬度带基色与季节模型)
  const outer = rings[0];
  const meanLat = outer.reduce((s, [lat]) => s + lat, 0) / outer.length;

  const baseColor = baseColorForLat(meanLat);
  const material = new THREE.MeshBasicMaterial({
    color: baseColor.clone(),
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    side: THREE.DoubleSide, // 朝向校验之外的兜底:极端小环/退化环也不出现黑洞
  });
  return { key, iso, geometry, material, baseColor, meanLat };
}

/** 拆出一个 feature 的全部 Polygon(统一 Polygon/MultiPolygon) */
function polygonsOf(f: GeoFeature): number[][][][] {
  return f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
}

interface CountryFillsProps {
  /** 节能档:填充再抽稀一档 */
  simplify: boolean;
}

export default function CountryFills({ simplify }: CountryFillsProps) {
  const selectedIso = useAppStore((s) => s.selectedCountryIso);

  // 构建期一次:几何 + 材质全部缓存;只有画质档的抽稀开关变化才重建
  const entries = useMemo(() => {
    const out: FillEntry[] = [];
    for (const f of geoData.features) {
      const iso = f.properties.id;
      polygonsOf(f).forEach((poly, i) => {
        const entry = buildEntry(`${iso}:${i}`, iso, poly, simplify);
        if (entry) out.push(entry);
      });
    }
    return out;
  }, [simplify]);

  // 注册到季节调色注册表;卸载/重建时注销并释放 GPU 资源
  useEffect(() => {
    for (const e of entries) {
      registerFill(e.key, { material: e.material, baseColor: e.baseColor, meanLat: e.meanLat });
    }
    return () => {
      for (const e of entries) {
        unregisterFill(e.key);
        e.geometry.dispose();
        e.material.dispose();
      }
    };
  }, [entries]);

  // 选中态:有选中时其他国家透明度降至 0.55(DESIGN.md §3.3)
  useEffect(() => {
    for (const e of entries) {
      e.material.opacity = selectedIso === null ? 0.92 : e.iso === selectedIso ? 0.95 : 0.55;
    }
  }, [entries, selectedIso]);

  return (
    <group>
      {entries.map((e) => (
        <mesh
          key={e.key}
          geometry={e.geometry}
          material={e.material}
          scale={e.iso === selectedIso ? SELECTED_LIFT : 1}
          raycast={noRaycast}
        />
      ))}
    </group>
  );
}
