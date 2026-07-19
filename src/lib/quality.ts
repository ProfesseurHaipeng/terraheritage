/**
 * 画质档位 —— DESIGN.md §4.2。
 * 首进按 hardwareConcurrency / deviceMemory / WebGL / 减少动态 自动选档,
 * 设置面板可手动改(store.quality)。
 */

export type Quality = 'high' | 'balanced' | 'saver';

export interface QualitySpec {
  /** 设备像素比上限 */
  dpr: number;
  /** 星星数量 */
  stars: number;
  /** 国家填充是否抽稀(节能档用) */
  simplifyFills: boolean;
  /** 海洋 shader 是否启用日光高光 */
  oceanSpecular: boolean;
}

export const QUALITY_SPECS: Record<Quality, QualitySpec> = {
  high: { dpr: 2, stars: 6000, simplifyFills: false, oceanSpecular: true },
  balanced: { dpr: 1.5, stars: 3000, simplifyFills: false, oceanSpecular: true },
  saver: { dpr: 1, stars: 1500, simplifyFills: true, oceanSpecular: false },
};

/** 系统是否偏好减少动态(媒体查询单次读取,SSR 安全) */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** 自动选档:低核数/低内存/减少动态 → 降级 */
export function detectQuality(): Quality {
  if (typeof navigator === 'undefined') return 'balanced';
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory 仅部分浏览器提供
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (prefersReducedMotion()) return 'saver';
  if (cores <= 4 || mem <= 4) return 'saver';
  if (cores <= 8 || mem <= 8) return 'balanced';
  return 'high';
}
