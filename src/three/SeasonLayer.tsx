/**
 * 季节着色层 —— DESIGN.md §4 SeasonLayer。
 * 每帧读取 store 中的月份,对 fillRegistry 里每个国家填充材质的目标色做
 * 指数趋近 lerp(约 0.8s 收敛),实现切换月份时地表色平滑过渡:
 *  - 冬季高纬(|φ|>50°)向雪色 --snow #DDE6EC 偏移
 *  - 热带雨季向绿偏移,旱季向暖土 --land-dry 偏移
 * 调色权重来自 lib/season.ts 的 landSeasonFactors(纯函数)。
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { landSeasonFactors } from '@/lib/season';
import { useAppStore } from '@/stores/appStore';
import { forEachFill } from './fillRegistry';

const GREEN = new THREE.Color('#3E5C48');
const DRY = new THREE.Color('#6E5B44');
const SNOW = new THREE.Color('#DDE6EC');

/** 目标色 = 纬度带基色经季节权重调制(每帧临时对象,避免分配) */
const tmp = new THREE.Color();

function seasonalTarget(base: THREE.Color, meanLat: number, month: number): THREE.Color {
  const { green, dry, snow } = landSeasonFactors(month, meanLat);
  tmp.copy(base);
  tmp.lerp(GREEN, green * 0.45); // 雨季/夏季偏绿
  tmp.lerp(DRY, dry * 0.6); // 旱季/秋季偏土色
  tmp.lerp(SNOW, snow * 0.9); // 冬季高纬偏雪色
  return tmp;
}

export default function SeasonLayer() {
  useFrame((_, dt) => {
    const { month } = useAppStore.getState().season;
    // 指数趋近:约 0.8s 收敛到目标色的 99%+
    const k = 1 - Math.exp((-5 * dt) / 0.8);
    forEachFill((f) => {
      f.material.color.lerp(seasonalTarget(f.baseColor, f.meanLat, month), k);
    });
  });
  return null;
}
