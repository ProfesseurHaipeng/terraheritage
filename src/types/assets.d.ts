/**
 * 内置 GeoJSON 的模块声明。
 * 不开启 resolveJsonModule(避免 400KB JSON 字面量类型拖慢 tsc),
 * 以环境模块声明确保 TS strict 通过;Vite 原生支持 JSON 导入。
 */
declare module '@/data/geo/countries.geo.json' {
  import type { GeoFeatureCollection } from '@/types';
  const data: GeoFeatureCollection;
  export default data;
}
