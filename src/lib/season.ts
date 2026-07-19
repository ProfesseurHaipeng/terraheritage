/**
 * 季节系统(纯函数,可测)—— DESIGN.md §1.4 / §4 SeasonLayer。
 * 规则:
 *  - 北半球(φ ≥ 23.5°):春 3–5 月 / 夏 6–8 / 秋 9–11 / 冬 12–2
 *  - 南半球(φ ≤ -23.5°):与北半球相反(相差 6 个月)
 *  - 热带(|φ| < 23.5°):雨季 / 旱季;雨季 = 当地夏至前后各 3 个月
 *    (北热带夏至在 6 月 → 雨季约 4–9 月;南热带夏至在 12 月 → 雨季约 10–3 月)
 */

export type SeasonModel = 'northern' | 'southern' | 'tropical';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'rainy' | 'dry';

export interface SeasonState {
  model: SeasonModel;
  season: Season;
}

/** 回归线纬度(热带边界) */
export const TROPIC_LAT = 23.5;

/** 判定某纬度使用的季节模型 */
export function seasonModelForLat(lat: number): SeasonModel {
  if (Math.abs(lat) < TROPIC_LAT) return 'tropical';
  return lat >= 0 ? 'northern' : 'southern';
}

/** 给定月份(1–12)与纬度,返回季节状态 */
export function getSeasonState(month: number, lat: number): SeasonState {
  const model = seasonModelForLat(lat);
  if (model === 'tropical') {
    // 雨季 = 当地夏至前后各 3 个月;北热带夏至 6 月,南热带 12 月
    const solstice = lat >= 0 ? 6 : 12;
    // 以夏至月为中心、前后各 3 个月(共 6 个月)视为雨季
    const diff = Math.min(Math.abs(month - solstice), 12 - Math.abs(month - solstice));
    return { model, season: diff <= 3 ? 'rainy' : 'dry' };
  }
  // 南北半球四季:南半球把月份平移 6 个月再套北半球表
  const m = model === 'southern' ? ((month + 5) % 12) + 1 : month;
  if (m >= 3 && m <= 5) return { model, season: 'spring' };
  if (m >= 6 && m <= 8) return { model, season: 'summer' };
  if (m >= 9 && m <= 11) return { model, season: 'autumn' };
  return { model, season: 'winter' };
}

/**
 * 季节对应的陆地调色系数(供 CountryFills 混色用)。
 * 返回 { green, dry, snow } 三个 0–1 权重:
 *  - 冬季且高纬(|φ| > 50°)向雪盖偏移(snow↑)
 *  - 热带雨季向绿偏移(green↑),旱季向枯黄偏移(dry↑)
 *  - 温带夏季偏绿、秋季偏枯黄,春季介于其间
 * 权重未归一化,混色时各以独立系数 lerp。
 */
export function landSeasonFactors(month: number, lat: number): {
  green: number;
  dry: number;
  snow: number;
} {
  const { model, season } = getSeasonState(month, lat);
  let green = 0.3; // 基础绿度
  let dry = 0;
  let snow = 0;

  if (model === 'tropical') {
    if (season === 'rainy') green = 0.85;
    else {
      green = 0.15;
      dry = 0.6;
    }
  } else {
    switch (season) {
      case 'spring':
        green = 0.55;
        break;
      case 'summer':
        green = 0.75;
        break;
      case 'autumn':
        green = 0.25;
        dry = 0.35;
        break;
      case 'winter':
        green = 0.1;
        dry = 0.2;
        // 冬季高纬(φ>50°)雪盖,|φ| 越大雪越厚
        if (Math.abs(lat) > 50) snow = Math.min(1, (Math.abs(lat) - 50) / 25 + 0.3);
        break;
    }
  }
  return { green, dry, snow };
}

/** 国家代表纬度:用其所有环顶点的纬度均值(近似质心) */
export function featureMeanLat(rings: [number, number][][]): number {
  let sum = 0;
  let n = 0;
  for (const ring of rings) {
    for (const [lat] of ring) {
      sum += lat;
      n++;
    }
  }
  return n === 0 ? 0 : sum / n;
}
