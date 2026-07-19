/**
 * 国家填充材质注册表(模块级)。
 * CountryFills 在创建/销毁时注册,SeasonLayer 每帧遍历做 0.8s 平滑调色,
 * 避免每帧重建 geometry,也避免把 mesh 引用塞进 zustand。
 */
import type * as THREE from 'three';

export interface FillHandle {
  /** 该国的填充材质(颜色由 SeasonLayer 驱动) */
  material: THREE.MeshBasicMaterial;
  /** 纬度带基色(未加季节调制) */
  baseColor: THREE.Color;
  /** 国家代表纬度(外环顶点纬度均值) */
  meanLat: number;
}

const fills = new Map<string, FillHandle>();

export function registerFill(key: string, h: FillHandle): void {
  fills.set(key, h);
}

export function unregisterFill(key: string): void {
  fills.delete(key);
}

export function forEachFill(cb: (h: FillHandle) => void): void {
  fills.forEach(cb);
}
