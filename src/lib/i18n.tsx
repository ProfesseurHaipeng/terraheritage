/**
 * 自研轻量 i18n:dictionary + React context + useT() hook(zh/en)。
 * 文案覆盖 DESIGN.md §6 涉及的全部界面文案。
 */
import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { useAppStore } from '@/stores/appStore';

export type Locale = 'zh' | 'en';

/** 界面文案字典(zh/en 双份,key 一一对应) */
const dict = {
  // ---- 首页引导 ----
  slogan: {
    zh: '探索土地、植物与人类文化之间延续千年的联系',
    en: 'Explore the millennia-old bonds between land, plants, and human cultures',
  },
  subtitle: {
    zh: '从季节变化到民族医学,从一株植物到一片文明',
    en: 'From turning seasons to medical traditions — from a single plant to a whole civilization',
  },
  enterExplore: { zh: '开始探索', en: 'Start Exploring' },
  enterRandom: { zh: '随机前往', en: 'Take Me Anywhere' },
  enterFlowering: { zh: '查看此刻正在开花的植物', en: 'Plants Flowering Right Now' },
  enterStory: { zh: '进入今日文化故事', en: "Today's Cultural Story" },
  statsCountries: { zh: '国家', en: 'Countries' },
  statsPlants: { zh: '植物', en: 'Plants' },
  statsCultures: { zh: '民族文化', en: 'Cultures' },
  statsMedicines: { zh: '医学体系', en: 'Medical Traditions' },
  statsSources: { zh: '来源', en: 'Sources' },

  // ---- Header ----
  appTitle: { zh: '万物本草 TerraHeritage', en: 'TerraHeritage 万物本草' },
  search: { zh: '搜索', en: 'Search' },
  layers: { zh: '图层', en: 'Layers' },
  settings: { zh: '设置', en: 'Settings' },
  switchLang: { zh: 'EN', en: '中文' },

  // ---- 图层 ----
  layerBorders: { zh: '国家边界', en: 'Borders' },
  layerPlants: { zh: '植物', en: 'Plants' },
  layerCultures: { zh: '民族文化', en: 'Cultures' },
  layerMedicine: { zh: '传统医学', en: 'Medicine' },
  layerRoutes: { zh: '历史路线', en: 'Routes' },
  layerLabels: { zh: '国名标签', en: 'Labels' },

  // ---- 合规 ----
  disclaimer: {
    zh: '本页面用于文化、历史和科学教育,不提供个人医疗建议。',
    en: 'This page is for cultural, historical, and scientific education only. It is not personal medical advice.',
  },
  insufficient: {
    zh: '当前数据库没有足够经过审核的资料。',
    en: 'Our database does not yet hold enough reviewed material on this topic.',
  },
  reviewDraft: { zh: '示例数据 · 待审核', en: 'Sample data · pending review' },
  routeSpeculative: { zh: '示意路线 · 历史推测', en: 'Illustrative route · historical hypothesis' },
  sourceTitle: { zh: '来源', en: 'Sources' },
  sourceAccessed: { zh: '访问日期', en: 'Accessed' },
  sensitiveHarvest: {
    zh: '不可随意采集,推荐合法人工栽培来源',
    en: 'Do not harvest from the wild; choose legal cultivated sources',
  },

  // ---- 面板 ----
  enterCountry: { zh: '进入探索', en: 'Explore' },
  culturalView: { zh: '文化与历史视角', en: 'Cultural & Historical View' },
  scienceView: { zh: '现代证据视角', en: 'Modern Evidence View' },
  evidenceLevel: { zh: '证据等级', en: 'Evidence level' },
  safetyNotes: { zh: '安全提示', en: 'Safety' },
  modernLife: { zh: '现代生活', en: 'Modern Life' },
  close: { zh: '关闭', en: 'Close' },

  // ---- 季节 ----
  seasonCycle: { zh: '四季轮转', en: 'Cycle' },
  seasonByMonth: { zh: '按月查看', en: 'By Month' },
  playYear: { zh: '播放全年', en: 'Play Year' },
  spring: { zh: '春', en: 'Spring' },
  summer: { zh: '夏', en: 'Summer' },
  autumn: { zh: '秋', en: 'Autumn' },
  winter: { zh: '冬', en: 'Winter' },
  rainy: { zh: '雨季', en: 'Rainy season' },
  dry: { zh: '旱季', en: 'Dry season' },

  // ---- 加载器 ----
  loading1: { zh: '正在准备地球', en: 'Preparing the Earth' },
  loading2: { zh: '正在加载地形', en: 'Loading terrain' },
  loading3: { zh: '正在载入生态数据', en: 'Loading ecological data' },

  // ---- 设置 ----
  qualityHigh: { zh: '高', en: 'High' },
  qualityBalanced: { zh: '平衡', en: 'Balanced' },
  qualitySaver: { zh: '节能', en: 'Saver' },
  reducedMotion: { zh: '减少动态效果', en: 'Reduce motion' },
  language: { zh: '语言', en: 'Language' },

  // ---- 键盘 ----
  kbRotate: { zh: '空格:自转开关', en: 'Space: toggle rotation' },
  kbEsc: { zh: 'Esc:关闭面板', en: 'Esc: close panel' },
  kbReset: { zh: 'R:回全球', en: 'R: global view' },
  kbFocus: { zh: 'F:聚焦选中国', en: 'F: focus selection' },
  kbLayer: { zh: 'L:图层面板', en: 'L: layer panel' },
  kbSearch: { zh: '⌘K:搜索', en: '⌘K: search' },

  // ---- 徽章 ----
  reviewPartial: { zh: '部分审核', en: 'Partially reviewed' },
  reviewReviewed: { zh: '已审核', en: 'Reviewed' },
  evidenceA: { zh: 'A · 人体证据较充分', en: 'A · Strong human evidence' },
  evidenceB: { zh: 'B · 人体证据有限', en: 'B · Limited human evidence' },
  evidenceC: { zh: 'C · 初步证据', en: 'C · Preliminary evidence' },
  evidenceD: { zh: 'D · 证据很少', en: 'D · Very little evidence' },
  evidenceE: { zh: 'E · 不足或有争议', en: 'E · Insufficient or contested' },
  sensitiveBlurred: { zh: '位置已模糊', en: 'Location blurred' },
  riskWarn: { zh: '注意', en: 'Caution' },
  riskHigh: { zh: '高风险', en: 'High risk' },

  // ---- 来源抽屉 ----
  viewSources: { zh: '查看来源', en: 'View sources' },
  sourceLicense: { zh: '许可', en: 'License' },
  sourceTier: { zh: '等级', en: 'Tier' },
  openOriginal: { zh: '原始链接', en: 'Original link' },
  sourcesCountSuffix: { zh: '条来源', en: 'sources' },

  // ---- 卡片字段 ----
  capital: { zh: '首都', en: 'Capital' },
  languagesLabel: { zh: '语言', en: 'Languages' },
  ecosystems: { zh: '生态', en: 'Ecosystems' },
  regionsLabel: { zh: '代表区域', en: 'Regions' },
  overview: { zh: '概览', en: 'Overview' },
  distribution: { zh: '分布', en: 'Distribution' },
  altitude: { zh: '海拔', en: 'Altitude' },
  flowering: { zh: '花期', en: 'Flowering' },
  familyLabel: { zh: '科属', en: 'Family' },
  localName: { zh: '当地名', en: 'Local name' },
  nativeRange: { zh: '原产地', en: 'Native range' },
  traditions: { zh: '传统', en: 'Traditions' },
  selfName: { zh: '自称', en: 'Autonym' },
  history: { zh: '历史', en: 'History' },
  philosophy: { zh: '核心理念', en: 'Philosophy' },
  practices: { zh: '实践概述', en: 'Practices' },
  modernResearch: { zh: '现代研究', en: 'Modern research' },
  safetyRegulation: { zh: '安全与监管', en: 'Safety & regulation' },
  regionsTextLabel: { zh: '流传地区', en: 'Regions practiced' },
  backToCountry: { zh: '返回国家', en: 'Back to country' },
  currentSeason: { zh: '当前季节', en: 'Current season' },

  // ---- 搜索 ----
  searchPlaceholder: {
    zh: '搜索国家、植物、民族、医学体系…',
    en: 'Search countries, plants, cultures, medicine…',
  },
  searchNoResults: { zh: '没有匹配的结果', en: 'No matching results' },
  groupCountries: { zh: '国家', en: 'Countries' },
  groupPlants: { zh: '植物', en: 'Plants' },
  groupCultures: { zh: '民族文化', en: 'Cultures' },
  groupMedicine: { zh: '医学体系', en: 'Medical Traditions' },

  // ---- 图层/图例 ----
  legend: { zh: '图例', en: 'Legend' },

  // ---- 设置 ----
  qualityLabel: { zh: '画质', en: 'Quality' },
  about: { zh: '关于', en: 'About' },

  // ---- 季节控制 ----
  pause: { zh: '暂停', en: 'Pause' },

  // ---- About 页 ----
  aboutVision: {
    zh: '一个非营利的益智教育平台 / 数字博物馆:以 3D 地球为线索,沿「地点 → 生态 → 季节 → 植物 → 民族 → 传统医学 → 现代证据 → 安全」的知识链,探索土地、植物与人类文化之间延续千年的联系。',
    en: 'A non-profit educational platform / digital museum: following the chain place → ecology → season → plant → people → traditional medicine → modern evidence → safety, TerraHeritage explores the millennia-old bonds between land, plants and human cultures on a 3D globe.',
  },
  aboutScopeTitle: { zh: 'MVP 范围', en: 'MVP scope' },
  aboutScopeBody: {
    zh: '真实球形 3D 地球(星空、大气、自转、拖拽缩放)、国家边界悬停与选中、重点示例国家与区域、四季与雨旱联动、植物知识卡(文化 / 现代证据双层)、民族文化与传统医学图层、历史传播路线示意、全局搜索与中英双语、三档画质与减少动态。',
    en: 'A true spherical 3D globe (stars, atmosphere, auto-rotation, drag & zoom), country hover & selection, featured countries and regions, season & rain/dry linkage, dual-perspective plant cards (cultural / modern evidence), culture & traditional-medicine layers, illustrative historical routes, global search, Chinese/English UI, three quality tiers and reduced motion.',
  },
  aboutDataTitle: { zh: '数据与审核声明', en: 'Data & review statement' },
  aboutDataBody: {
    zh: '本站全部内容数据均为示例数据,状态标记为「待审核」;宁可少,不可假。每条数据附真实存在的来源机构链接;地理边界数据来自 Natural Earth(公共领域)。濒危与敏感物种的坐标只展示到生态区级别。',
    en: 'All content on this site is sample data marked “pending review” — better less than false. Every entry links to real source institutions; geographic boundaries come from Natural Earth (public domain). Coordinates of endangered or sensitive species are shown only at eco-region granularity.',
  },
  aboutSourcesTitle: { zh: '来源机构', en: 'Source institutions' },
  aboutOssTitle: { zh: '开源说明', en: 'Open source' },
  aboutOssBody: {
    zh: '代码以 MIT 许可证开源;图片为 AI 生成的示意插画;数据为未审核示例。路线图:MVP → 数据工程 → 全球扩展。',
    en: 'Code is open-sourced under the MIT license; images are AI-generated illustrations; data is unreviewed sample content. Roadmap: MVP → data engineering → global coverage.',
  },

  // ---- 无障碍播报 ----
  narratorSelected: { zh: '已选中', en: 'Selected' },
  narratorMonth: { zh: '月份', en: 'Month' },
  narratorLayerOn: { zh: '图层已开启', en: 'layer enabled' },
  narratorLayerOff: { zh: '图层已关闭', en: 'layer disabled' },
} as const;

/** 月份名(1–12,数组下标 0 = 1 月) */
export const MONTH_NAMES: Record<Locale, string[]> = {
  zh: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export type DictKey = keyof typeof dict;

const LocaleContext = createContext<Locale>('zh');

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useAppStore((s) => s.locale);
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** 取一条文案 */
export function useT() {
  const locale = useContext(LocaleContext);
  return useCallback((key: DictKey): string => dict[key][locale], [locale]);
}
