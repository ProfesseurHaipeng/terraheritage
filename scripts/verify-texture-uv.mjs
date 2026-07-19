/**
 * 纹理方向验证脚本(node scripts/verify-texture-uv.mjs)
 *
 * 目的:确认 three.js SphereGeometry 的 UV 与本项目 latLngToVec3 经度约定
 * (经度 0° → +z,东经 90° → +x)之间的偏移量,使 NASA equirect 纹理
 * (u=0 ↔ 180°W,顶部 = 北极)贴到正确的大洲上。
 *
 * 方法:不凭公式想当然,直接用 three@0.178 的 SphereGeometry 生成的真实
 * 顶点/UV 数据:对每个顶点,用项目 geo.ts 的约定反算经纬度,再观察该顶点
 * 的 uv,得出 uv = f(lat, lng) 的实测映射,与纹理约定比对。
 */
import * as THREE from 'three';

// ---- 与 src/lib/geo.ts 完全一致的约定 ----
const DEG = Math.PI / 180;
function latLngToVec3(lat, lng, r = 1) {
  const phi = lat * DEG;
  const theta = lng * DEG;
  const c = Math.cos(phi);
  return new THREE.Vector3(r * c * Math.sin(theta), r * Math.sin(phi), r * c * Math.cos(theta));
}
function vec3ToLatLng(v) {
  const r = v.length();
  const lat = Math.asin(THREE.MathUtils.clamp(v.y / r, -1, 1)) / DEG;
  const lng = Math.atan2(v.x, v.z) / DEG;
  return [lat, lng];
}

// ---- 1. 用真实 SphereGeometry 顶点数据实测 uv 映射 ----
const geo = new THREE.SphereGeometry(1, 96, 96);
const pos = geo.attributes.position;
const uv = geo.attributes.uv;

const samples = [];
for (let i = 0; i < pos.count; i++) {
  const p = new THREE.Vector3().fromBufferAttribute(pos, i);
  const [lat, lng] = vec3ToLatLng(p);
  samples.push({ lat, lng, u: uv.getX(i), v: uv.getY(i) });
}

// 对每个顶点:预测 u_pred = (lng + 90)/360(归一到 [0,1)),v_pred = 0.5 + lat/180
// 统计实测与预测的偏差
let maxUDev = 0;
let maxVDev = 0;
for (const s of samples) {
  if (Math.abs(s.lat) > 89) continue; // 极点经度退化,跳过
  let uPred = (s.lng + 90) / 360;
  uPred = ((uPred % 1) + 1) % 1;
  let du = Math.abs(s.u - uPred);
  du = Math.min(du, 1 - du); // 环绕
  const dv = Math.abs(s.v - (0.5 + s.lat / 180));
  if (du > maxUDev) maxUDev = du;
  if (dv > maxVDev) maxVDev = dv;
}
console.log('== SphereGeometry(1,96,96) 实测 (' + pos.count + ' 顶点) ==');
console.log('实测映射: u = (lng + 90) / 360,  v = 0.5 + lat / 180');
console.log('u 最大偏差: ' + maxUDev.toExponential(2) + ' (≈ ' + (maxUDev * 360).toFixed(4) + '° 经度)');
console.log('v 最大偏差: ' + maxVDev.toExponential(2));

// ---- 2. 纹理约定:标准 NASA equirect,u_tex = (lng + 180)/360,顶部 = 北极 ----
// 偏移量 offset 需满足 u + offset ≡ u_tex (mod 1)
console.log('\n== 偏移推导 ==');
console.log('u_tex = (lng+180)/360, u = (lng+90)/360  ⇒  offset.x = +0.25 (wrapS=Repeat)');

// ---- 3. 逐点核对:已知地标经 UV+offset 后落在纹理的哪个像素 ----
const W = 2048; // earth_atmos_2048.jpg 宽度(高度由像素检查脚本确认)
const landmarks = [
  ['中国(北京附近)', 40, 116],
  ['中国(中部)', 35, 105],
  ['巴西(亚马孙)', -10, -55],
  ['澳大利亚(中部)', -25, 135],
  ['撒哈拉', 23, 10],
  ['印度', 22, 78],
  ['中太平洋(应为大洋)', 0, -150],
  ['格陵兰', 72, -40],
];
console.log('\n== 地标 → 纹理像素 (offset.x=0.25) ==');
for (const [name, lat, lng] of landmarks) {
  const p = latLngToVec3(lat, lng);
  // 找到与该顶点最近的球面顶点,取其 uv(模拟 GPU 采样路径)
  let best = null;
  let bestD = Infinity;
  for (const s of samples) {
    const q = latLngToVec3(s.lat, s.lng);
    const d = p.distanceToSquared(q);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  const uTex = (best.u + 0.25) % 1;
  const vTex = best.v; // flipY=true: v=1 → 图像顶行(北极)
  const px = Math.round(uTex * W);
  const py = Math.round((1 - vTex) * (W / 2)); // 图像行号(顶部=0),高按 2048x1024 估
  const uExpected = ((lng + 180) / 360) % 1;
  console.log(
    `${name.padEnd(14)} lat=${String(lat).padStart(4)} lng=${String(lng).padStart(5)}` +
      ` → 球面uv=(${best.u.toFixed(4)}, ${best.v.toFixed(4)})` +
      ` → 纹理u=${uTex.toFixed(4)} (期望 ${uExpected.toFixed(4)})` +
      ` → 像素≈(${px}, ${py})`,
  );
}
console.log('\n结论判定:纹理u 与 期望u 一致 ⇒ offset.x=+0.25 修正成立。');
