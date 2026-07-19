/**
 * TerraHeritage 数据类型 —— DESIGN.md §5.1(与阶段1 §21 对齐的 MVP 子集)。
 * MVP 阶段所有内容数据 reviewStatus 一律为 'draft'(示例待审核)。
 */

/** 审核状态:draft 待审核 / partial 部分审核 / reviewed 已审核 */
export type ReviewStatus = 'draft' | 'partial' | 'reviewed';

/** 证据等级:A 人体证据充分 … E 不足或有争议 */
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'E';

/** 来源等级:阶段2 六级取前四(S 最高) */
export type SourceTier = 'S' | 'A' | 'B' | 'C';

/** 地理敏感度:public 公开 / grid10 / grid50(坐标只到生态区)/ adminOnly */
export type SensitivityLevel = 'public' | 'grid10' | 'grid50' | 'adminOnly';

/** 中英双语文本 */
export type LocalText = { zh: string; en: string };

/** 来源机构:只用真实存在的机构主页 URL */
export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  tier: SourceTier;
  licenseNote?: string;
  accessedAt: string; // 构建月份,如 2026-07
}

/** 植物知识卡 */
export interface Plant {
  id: string;
  names: { zh: string; en: string; latin: string; local?: string };
  family: string;
  nativeRangeText: LocalText;
  /** 示意标记点 [纬度, 经度] */
  distribution: [number, number][];
  altitudeText: LocalText;
  /** 开花月份(1–12) */
  floweringMonths: number[];
  harvestingNote?: LocalText;
  /** 文化视角(措辞:传统上被用于…/当地资料记载…) */
  culturalUse: LocalText;
  /** 现代证据视角 */
  modernEvidence: LocalText;
  evidenceLevel: EvidenceLevel;
  safetyNotes: LocalText;
  conservationStatus?: string;
  sensitivity: SensitivityLevel;
  image?: string;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

/** 国家信息 */
export interface CountryInfo {
  isoId: string; // ISO 数字码,与 countries.geo.json 的 properties.id 对齐
  names: { zh: string; en: string };
  capital?: string;
  languages: string[];
  overview: LocalText;
  ecosystems: string[];
  regionIds: string[];
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

/** 国内/国家内代表区域 */
export interface Region {
  id: string;
  countryIso: string;
  names: { zh: string; en: string };
  center: [number, number]; // [纬度, 经度]
  overview: LocalText;
  seasonModel: 'northern' | 'southern' | 'tropical';
}

/** 民族文化群体(必须含现代生活段) */
export interface CulturalGroup {
  id: string;
  names: { zh: string; en: string };
  selfName?: string;
  /** 主要分布示意点 [纬度, 经度] */
  areas: [number, number][];
  languageText: LocalText;
  overview: LocalText;
  /** 现代生活:当代生计、教育、城市化等 */
  modernLife: LocalText;
  traditions: LocalText;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

/** 传统医学体系 */
export interface MedicalTradition {
  id: string;
  names: { zh: string; en: string };
  regionsText: LocalText;
  history: LocalText;
  philosophy: LocalText;
  practices: LocalText;
  modernEvidence: LocalText;
  safetyAndRegulation: LocalText;
  sourceIds: string[];
  reviewStatus: ReviewStatus;
}

/** 内置 GeoJSON 的最小类型(避免额外依赖 @types/geojson) */
export interface GeoFeature {
  type: 'Feature';
  properties: { name: string; id: string };
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'MultiPolygon'; coordinates: number[][][][] };
}

/** GeoJSON FeatureCollection */
export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

/** 历史传播路线(注明"历史推测示意") */
export interface StoryRoute {
  id: string;
  names: { zh: string; en: string };
  kind: 'historical-spread' | 'migration' | 'trade';
  /** 路径点 [纬度, 经度] */
  path: [number, number][];
  note: LocalText;
  sourceIds: string[];
}
