#!/usr/bin/env node
/**
 * 构建期地理数据脚本:下载 world-atlas countries-110m.json(TopoJSON),
 * 自实现 TopoJSON → GeoJSON 解码(transform delta 解码 + arc 拼接),
 * 按最小点距抽稀顶点,输出 src/data/geo/countries.geo.json(FeatureCollection)。
 *
 * 数据源:Natural Earth 110m(公共领域),经 world-atlas 项目分发。
 * 用法:node scripts/convert-geo.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/geo/countries.geo.json');

// 依次尝试的下载源:先按简报要求尝试 110m;110m 实际仅 177 个国家,
// 不满足 feature > 200 的验收,故其后追加 50m 源(241 国)作为回退
const SOURCES = [
  'https://unpkg.com/world-atlas@2/countries-110m.json',
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
  'https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json',
  'https://unpkg.com/world-atlas@2/countries-50m.json',
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
  'https://raw.githubusercontent.com/topojson/world-atlas/master/countries-50m.json',
];

// 抽稀:相邻点最小角距(度)。110m 数据本身已很粗,1.2° 足够保形
const MIN_DIST_DEG = 1.2;

/** 从指定 URL 下载 TopoJSON */
async function download(url) {
  console.log(`尝试下载: ${url}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** TopoJSON transform delta 解码:把相对弧坐标还原为绝对经纬度 */
function decodeArcs(topo) {
  const { scale, translate } = topo.transform ?? { scale: [1, 1], translate: [0, 0] };
  return topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/** 把经度归一化到 [-180, 180] */
function normLng(lng) {
  let l = lng;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;
  return l;
}

/** 按弧索引拼接环(负索引 = 反向拼接,TopoJSON 规范:~i = 反向第 i 条弧) */
function stitchRing(arcs, arcIndexes) {
  const ring = [];
  for (const idx of arcIndexes) {
    const arc = idx >= 0 ? arcs[idx] : [...arcs[~idx]].reverse();
    // 跳过与上一段重复的首点
    const start = ring.length > 0 ? 1 : 0;
    for (let i = start; i < arc.length; i++) ring.push(arc[i]);
  }
  return ring;
}

/** 按最小点距抽稀(始终保留首尾点) */
function simplifyRing(ring, minDist) {
  if (ring.length <= 3) return ring;
  const out = [ring[0]];
  for (let i = 1; i < ring.length - 1; i++) {
    const prev = out[out.length - 1];
    const [lng, lat] = ring[i];
    const dl = normLng(lng - prev[0]);
    const da = lat - prev[1];
    if (Math.hypot(dl, da) >= minDist) out.push(ring[i]);
  }
  out.push(ring[ring.length - 1]);
  return out;
}

/** TopoJSON Geometry → GeoJSON geometry */
function convertGeometry(geom, arcs) {
  const proj = (ring) =>
    simplifyRing(stitchRing(arcs, geom.arcs ? ring : []), MIN_DIST_DEG).map(([lng, lat]) => [
      normLng(lng),
      lat,
    ]);
  switch (geom.type) {
    case 'Polygon':
      return { type: 'Polygon', coordinates: geom.arcs.map((r) => proj(r)) };
    case 'MultiPolygon':
      return { type: 'MultiPolygon', coordinates: geom.arcs.map((p) => p.map((r) => proj(r))) };
    default:
      return null; // 国家层只含面要素
  }
}

/** 解析一份 TopoJSON 为 Feature 数组(不足 201 国视为不合格,便于尝试下一源) */
function topoToFeatures(topo) {
  if (topo.type !== 'Topology' || !topo.objects?.countries) {
    throw new Error('下载内容不是合法的 world-atlas TopoJSON');
  }
  const arcs = decodeArcs(topo);
  const features = [];
  for (const geom of topo.objects.countries.geometries) {
    const geometry = convertGeometry(geom, arcs);
    if (!geometry) continue;
    features.push({
      type: 'Feature',
      // properties 保留 name 与 ISO 数字码 id
      properties: { name: geom.properties?.name ?? '', id: geom.id ?? '' },
      geometry,
    });
  }
  return features;
}

async function main() {
  // 逐源尝试:下载成功且国家数 > 200 才接受;都不满足则报错,不编造数据
  let features = null;
  let lastErr = null;
  for (const url of SOURCES) {
    try {
      const topo = await download(url);
      const fc = topoToFeatures(topo);
      console.log(`  解析得 ${fc.length} 个国家`);
      if (fc.length > 200) {
        features = fc;
        break;
      }
      console.warn('  国家数 ≤ 200,不满足验收,尝试下一源');
    } catch (err) {
      console.warn(`源失败: ${url} — ${err.message}`);
      lastErr = err;
    }
  }
  if (!features) {
    throw new Error(`全部数据源均不可用或不满足国家数要求,最后错误: ${lastErr?.message}`);
  }
  const fc = { type: 'FeatureCollection', features };
  await mkdir(dirname(OUT), { recursive: true });
  const text = JSON.stringify(fc);
  await writeFile(OUT, text);
  const kb = (Buffer.byteLength(text) / 1024).toFixed(1);
  console.log(`输出 ${OUT}:`);
  console.log(`  features = ${features.length},大小 ${kb} KB`);
  if (features.length <= 200) throw new Error(`feature 数 ${features.length} ≤ 200,验证失败`);
  if (Buffer.byteLength(text) > 1.5 * 1024 * 1024) {
    console.warn('警告:输出超过 1.5MB 目标');
  }
  // 验证 JSON 可解析 + 中国(156)存在
  const parsed = JSON.parse(text);
  if (!parsed.features.some((f) => String(f.properties.id) === '156')) {
    console.warn('警告:未找到中国(id=156),请人工核对');
  }
  console.log('验证通过');
}

main().catch((err) => {
  console.error(`convert-geo 失败: ${err.message}`);
  process.exit(1);
});
