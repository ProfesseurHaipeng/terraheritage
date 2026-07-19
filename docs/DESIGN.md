# TerraHeritage「万物本草」MVP 设计与实施规格

> 本文件是编码代理的唯一权威简报。实现时以本文件为准;数据与合规细节参考
> `../阶段234-结构化摘要.md`。目标:一个可 `npm run build` 通过、可本地运行、
> 可开源发布的静态 3D 数字地球网站 MVP。

---

## 1. 产品定位与 MVP 范围

非营利益智教育平台 / 数字博物馆:3D 地球是主角,UI 是辅助。
核心知识链:**地点 → 生态 → 季节 → 植物 → 民族 → 传统医学 → 现代证据 → 安全**。

MVP 必须实现(缺一不算完成):

1. 真实球形 3D 地球:星空背景、大气光晕、自动缓转、拖拽旋转、滚轮缩放、阻尼惯性
2. 国家边界渲染 + 悬停高亮 + 单击选中(高亮增强 + 右侧信息面板)+ 双击/按钮飞近聚焦
3. 重点示例国家 ≥10(含中国深度试点:云南/四川/西藏/青海)
4. 季节系统:春夏秋冬 + 当前月份;南北半球逻辑相反;热带显示雨季/旱季;切换时地表色彩、雪线、植物状态联动
5. 植物知识卡片 ≥8 种:双层展示(文化视角 / 现代证据视角)+ 证据等级(A–E)+ 安全提示
6. 民族文化图层 + 传统医学图层(示例数据,医学页顶部固定免责声明)
7. 历史传播路线示意图层(发光弧线,标注"示意/历史推测")
8. 首页引导:宇宙镜头缓慢靠近、标语、副标题、4 个入口按钮、底部统计
9. 全局搜索(国家/植物/民族/医学体系)+ 中英双语切换(界面全量,内容至少标题级)
10. 合规 UI:医疗免责声明、每条数据的来源标签与"示例数据待审核"徽章、来源抽屉
11. 响应式:移动端底部抽屉;减少动态效果;三档画质(高/平衡/节能)+ 低性能自动降级

明确不做(本阶段):后端、账号系统、CMS、真实 3D 植物模型、音频、VR/AR、
全球全量数据。**所有内容数据均为示例数据,状态标记为"待审核"。**

---

## 2. 技术选型

| 决策 | 选择 | 理由 |
|---|---|---|
| 构建 | Vite 7 + React 19 + TypeScript strict | 交接包已有脚手架 |
| 3D | three + @react-three/fiber + @react-three/drei | 方案 B,艺术化定制地球 |
| 状态 | zustand | 轻量,跨 3D/DOM 共享 |
| 样式 | Tailwind 3 + 少量 CSS 变量 | 脚手架已有;Design Token 用 CSS 变量落地 |
| i18n | 自研轻量 dictionary + React context(zh/en) | 避免重依赖 |
| 地理数据 | 内置 vendored GeoJSON(Natural Earth 110m,公共领域) | 规范禁止运行时依赖外部 API |
| 路由 | react-router(已有) | `/` 首页+探索,保留 `/about` 静态页 |

后端:无。数据以 TS 模块内置(`src/data/`),构建期打包。

---

## 3. 视觉系统(Design Token,落地为 `src/styles/tokens.css` CSS 变量)

### 3.1 色彩(深色数字博物馆;语义来自阶段4,色值为定稿)

```
--space-bg:      #05080F   /* 宇宙背景深蓝黑 */
--space-bg-2:    #0A1020   /* 渐变远端 */
--ocean:         #0D1B2E   /* 深海蓝 */
--ocean-glow:    #1B3A5C
--land-base:     #22333A   /* 陆地暗基底 */
--land-green:    #3E5C48   /* 低饱和绿 */
--land-high:     #5A5E63   /* 高山岩灰 */
--land-dry:      #6E5B44   /* 暖土 */
--snow:          #DDE6EC
--paper:         #EDE7D6   /* 主文字:旧纸米白 */
--paper-dim:     rgba(237,231,214,0.62)
--paper-faint:   rgba(237,231,214,0.38)
--panel-bg:      rgba(8,13,22,0.78)  /* 毛玻璃面板 */
--panel-line:    rgba(237,231,214,0.10)
--accent:        #C9A15F   /* 药草金/铜金:文化、主强调 */
--eco:           #7BA889   /* 生态绿 */
--medicine:      #B0705A   /* 传统医学暗红棕 */
--science:       #7C9CC4   /* 现代证据冷蓝 */
--history:       #B08D57   /* 历史旧金 */
--protect:       #5FA8A0   /* 保护青绿 */
--warn:          #D08050   /* 警告橙 */
--risk:          #B4544A   /* 高风险克制红 */
--atmo:          #4C7FB8   /* 大气光晕 */
```

图层配色:生态=eco,文化=accent,医学=medicine,历史=history,科学=science,保护=protect。
不用颜色表达文化高低;警告色不刺眼但明显。

### 3.2 字体

```css
--font-body: -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
             "Noto Sans CJK SC", "Source Han Sans SC", sans-serif;
--font-display: Georgia, "Times New Roman", "Songti SC", "SimSun", serif; /* 人文标题,拉丁学名斜体 */
--font-mono: ui-monospace, "SF Mono", Menlo, monospace; /* 坐标/数据标签 */
```

- 拉丁学名必须 `<em>` 斜体;当地语言名称原样保留,不强制大写、不错误转写
- 中文禁用 `font-style: italic`;层级 7 级(页面标题/区域标题/卡片标题/正文/辅助/引用/数据标签)

### 3.3 动效规格(必须照参数实现)

- 地球空闲自转:约 360°/120s;用户交互即停,停止交互 4s 后恢复
- OrbitControls:`enableDamping: true, dampingFactor: 0.1, enablePan: false`,
  `minDistance = R*1.35, maxDistance = R*4.2`;**速度随高度缩放**:
  `rotateSpeed = altitude*0.25`, `zoomSpeed = (altitude+1)*0.12`(altitude 以 R 为单位)
- 镜头飞行:自写 CameraRig,沿球面插值(slerp 方向 + 高度曲线),1.6–2.2s,
  easeInOutCubic;飞行中锁定输入
- 国家悬停:边界线增亮 + 国名标签(不变暗);选中:描边发光增强 + 填充轻微抬升
  (填充 mesh 沿法线 +0.006R)+ 其他国填充透明度降至 0.55
- 标记点(植物/文化/城市):CSS2D 或 sprite;悬停面板**宽度展开**微交互:
  宽 0→15rem / 0.7s ease,内容 opacity 0→1 / 0.25s / 延迟 0.5s
- 首页标语:宽度裁切揭示动画 6s(overflow hidden, white-space nowrap)
- 面板:右侧滑入 300ms ease-out;图层淡入淡出 200ms
- 页面/视图切换:全屏 fader(#05080F)400ms ease-in-out
- 加载器:药丸进度条(宽 50%,高 12px,圆角 999px,距底 5rem),
  文案轮换:"正在准备地球 / 正在加载地形 / 正在载入生态数据",不显示虚假百分比
- 材质:全屏 SVG feTurbulence 噪点(baseFrequency 2.5, octaves 3),
  dark 下用 `mix-blend-mode: overlay; opacity: 0.06`
- **减少动态效果**(系统或设置开启):直接显示地球不播推进;禁用自转/粒子/飞行(改瞬移);
  只保留 opacity 淡入淡出。`prefers-reduced-motion` 媒体查询 + 设置开关双通道

---

## 4. 3D 场景架构(`src/three/`)

```
GlobeCanvas.tsx        R3F Canvas 容器(dpr 按画质档, antialias, 星空 fog)
  ├─ Stars.tsx         程序化星空(3000–6000 点,球壳分布,微闪)
  ├─ Earth.tsx         海洋球体(自定义 shader:fresnel 边缘光 + 日光高光)
  │   ├─ CountryFills.tsx   由 GeoJSON 生成每国填充 mesh(球面投影,见 §4.1)
  │   ├─ CountryBorders.tsx 边界 LineSegments(选中/悬停态发光加粗)
  │   └─ Atmosphere.tsx 背面加法混合壳层 shader(大气光晕 --atmo)
  ├─ SeasonLayer.tsx   季节着色:按月份/半球插值国家填充色;冬季高纬雪盖 shader 带
  ├─ RouteArcs.tsx     历史路线:大圆弧线 + dash 流动动画(发光 --history)
  ├─ Markers.tsx       植物/民族/医学/城市标记(instanced 或 CSS2D)
  └─ CameraRig.tsx     飞行控制 + 初始推进(宇宙 → 地球)
```

### 4.1 国家填充 mesh 算法(关键)

1. 构建期脚本 `scripts/convert-geo.mjs`:下载 world-atlas `countries-110m.json`(TopoJSON),
   转 GeoJSON,抽稀(rdp 或按点距),输出 `src/data/geo/countries.geo.json`
   (properties 至少保留 `name`、ISO 数字码 `id`;目标 < 1.5MB)
2. 运行时:对每个 polygon 环,经度相对环心展开(处理跨 180° 问题),
   以环心为原点做等距方位投影 → `THREE.ShapeUtils.earcut` 三角化 →
   顶点重投影回球面(半径 R*1.001)→ BufferGeometry。填充与边界共用展开逻辑。
3. 点击拾取:raycast 海洋球体得交点 → 转 lat/lng → point-in-polygon(自实现,
   对国家包围盒粗筛 + 射线法细判)→ 命中国家 id。悬停同理由 pointermove 节流驱动。
4. 国家名中文映射:`src/data/geo/countryNames.ts` 覆盖重点国,其余回落英文名。

### 4.2 性能档位

| 档 | dpr | 星星 | 填充细分 | 云/粒子 | 后处理 |
|---|---|---|---|---|---|
| 高 | ≤2 | 6000 | 全量 | 开 | fresnel+高光 |
| 平衡 | ≤1.5 | 3000 | 全量 | 关 | fresnel |
| 节能 | 1 | 1500 | 抽稀 | 关 | 无 |

首进按 `navigator.hardwareConcurrency`/`deviceMemory`/WebGL/减少动态 自动选档,设置里可改。

---

## 5. 数据层(`src/data/`)

### 5.1 类型(`src/types/index.ts`,与阶段1 §21 对齐的 MVP 子集)

```ts
type ReviewStatus = 'draft' | 'partial' | 'reviewed';   // MVP 一律 'draft'(示例待审核)
type EvidenceLevel = 'A'|'B'|'C'|'D'|'E';               // A人体充分…E不足/争议
type SourceTier = 'S'|'A'|'B'|'C';                       // 阶段2 六级取前四
type SensitivityLevel = 'public'|'grid10'|'grid50'|'adminOnly';

interface Source { id; title; organization; url; tier: SourceTier;
  licenseNote?; accessedAt: string; }                  // 只用真实存在的机构主页 URL
interface Plant { id; names: { zh; en; latin; local? }; family;
  nativeRangeText; distribution: [number,number][];    // 示意标记点 [lat,lng]
  altitudeText; floweringMonths: number[]; harvestingNote?;
  culturalUse: LocalText; modernEvidence: LocalText; evidenceLevel: EvidenceLevel;
  safetyNotes: LocalText; conservationStatus?: string; sensitivity: SensitivityLevel;
  image?: string; sourceIds: string[]; reviewStatus: ReviewStatus; }
interface CountryInfo { isoId: string; names: { zh; en }; capital?;
  languages: string[]; overview: LocalText; ecosystems: string[];
  regionIds: string[]; sourceIds: string[]; reviewStatus: ReviewStatus; }
interface Region { id; countryIso; names; center: [number,number];
  overview: LocalText; seasonModel: 'northern'|'southern'|'tropical'; }
interface CulturalGroup { id; names; selfName?; areas: [number,number][];
  languageText; overview: LocalText; modernLife: LocalText;   // 必须含现代生活
  traditions: LocalText; sourceIds: string[]; reviewStatus; }
interface MedicalTradition { id; names; regionsText; history: LocalText;
  philosophy: LocalText; practices: LocalText; modernEvidence: LocalText;
  safetyAndRegulation: LocalText; sourceIds: string[]; reviewStatus; }
interface StoryRoute { id; names; kind: 'historical-spread'|'migration'|'trade';
  path: [number,number][]; note: LocalText;                   // 注明"历史推测示意"
  sourceIds: string[]; }
type LocalText = { zh: string; en: string };
```

### 5.2 示例数据内容(人工编写,宁可少不可假)

- `countries.ts`:中国、印度、日本、泰国、希腊、埃及、肯尼亚、巴西、秘鲁、加拿大(≥10)
- `regions.ts`:云南、四川、西藏、青海 + 每国 1–2 个代表区
- `plants.ts`:红景天、雪莲、冬虫夏草(真菌)、三七、银杏、藏红花、青蒿、甘草(≥8;
  前四种图用 `/assets/plant-*.jpg`,其余用纯色卡)
- `cultures.ts`:藏族、彝族、傣族、白族、哈尼族、纳西族(≥6,含现代生活段)
- `medicine.ts`:中医、藏医药、傣医药、阿育吠陀(≥4)
- `routes.ts`:丝绸之路(陆/海)、茶马古道、青蒿传播示意(≥3 条弧线)
- `sources.ts`:只引用真实机构:Plants of the World Online (Kew)、GBIF、WHO、
  中国植物志(Flora of China)、UNESCO ICH、IUCN Red List、《中国药典》、
  Biodiversity Heritage Library、World Flora Online、NIH NCCIH 等;
  `url` 用机构主页或数据库首页,`accessedAt` 写构建月份
- 每条实体数据必须带 ≥1 sourceId;UI 必须能点出来源抽屉
- 濒危/敏感(雪莲、冬虫夏草):`sensitivity: 'grid50'`,坐标只到生态区,
  安全文案含"不可随意采集/推荐合法栽培来源"

---

## 6. 状态与 UI(`src/`)

```
stores/appStore.ts   zustand: { locale, quality, reducedMotion, selectedCountryIso,
  selectedRegionId, selectedPlantId, selectedCultureId, selectedMedicineId,
  layers: {borders,plants,cultures,medicine,routes,labels}, season: {mode:'cycle'|'month',
  month}, introDone, panelOpen, searchOpen, playing, mobileSheet }
lib/i18n.tsx         dictionary + useT(); lib/season.ts 南北半球/热带逻辑(纯函数,可测)
lib/geo.ts           latLng→vec3、展开、slerp 飞行路径、point-in-polygon
components/
  IntroOverlay.tsx   首页宇宙引导(标语揭示动画、4 按钮、统计行)
  Header.tsx         Logo + 搜索 + 图层 + 语言 + 设置
  SearchPalette.tsx  cmdk 风格搜索(分组:国家/植物/民族/医学;结果带 ReviewBadge)
  LayerPanel.tsx     图层开关 + 图例(用图层色)
  SeasonControl.tsx  四季/雨旱 + 月份滑块(1–12) + 播放全年
  DetailPanel.tsx    桌面右侧;按选中对象分发:
    CountryPanel / RegionPanel / PlantCard / CultureCard / MedicineCard
  SourceDrawer.tsx   来源抽屉(标题/机构/等级/许可/访问日期/原链)
  Badges.tsx         ReviewBadge / EvidenceBadge / RiskBadge / SensitiveBadge
  DisclaimerBar.tsx  医学视图顶部固定:"本页面用于文化、历史和科学教育,不提供个人医疗建议。"
  BottomSheet.tsx    移动端底部抽屉(上滑展开/下滑收起,单抽屉原则)
  SettingsPanel.tsx  画质档、减少动态、语言
  StatusNarrator.tsx aria-live 播报(当前国家/图层/季节)
pages/Home.tsx       整合;pages/About.tsx 项目说明+合规政策摘要
```

键盘:空格=暂停/恢复自转;Esc=关闭面板/返回;R=回全球;F=聚焦选中国。
3D 全部内容可从搜索/列表面板访问(非 3D 替代路径)。

### UI 文案硬要求

- 所有示例数据视图带 `ReviewBadge draft` = "示例数据 · 待审核"
- 植物卡分区:"文化与历史视角"(措辞:传统上被用于…/当地资料记载…)与
  "现代证据视角"(证据等级 A–E 徽章 + 安全提示);不得出现疗效承诺、剂量、制备步骤
- 医学体系卡顶部固定 DisclaimerBar;不得有购买/治疗引导
- 文化卡含"现代生活"段;禁用"神秘/原始/落后"等词
- 历史路线标注"示意路线 · 历史推测"
- 资料不足时显示:"当前数据库没有足够经过审核的资料。"

---

## 7. 文件结构(最终仓库根 = `terraheritage/`)

```
docs/DESIGN.md 本文件
scripts/convert-geo.mjs
public/assets/*.jpg|png  (9 个已生成资产)
src/
  main.tsx App.tsx index.css styles/tokens.css
  types/index.ts
  data/ (geo/countries.geo.json, geo/countryNames.ts, countries.ts, regions.ts,
         plants.ts, cultures.ts, medicine.ts, routes.ts, sources.ts, index.ts)
  lib/ (geo.ts, season.ts, i18n.tsx, quality.ts)
  stores/appStore.ts
  three/ (GlobeCanvas, Earth, CountryFills, CountryBorders, Atmosphere,
          Stars, SeasonLayer, RouteArcs, Markers, CameraRig)
  components/ (见 §6)
  pages/ (Home.tsx, About.tsx)
README.md README.zh-CN.md LICENSE .env.example .gitignore
```

工程要求:TS strict 通过;`npm run build` 零错误;组件职责单一;
3D 与业务 UI 分离;错误边界 + 加载态 + 空态;关键纯函数注释。

---

## 8. 验收清单(编码代理自检 + 编排者复核)

- [ ] `npm run build` 通过,无 TS 错误
- [ ] 地球自转/拖拽/缩放/阻尼;悬停国名;单击面板;双击飞近
- [ ] 季节切换地表变色 + 南北半球相反 + 热带雨旱(云南显示雨/旱)
- [ ] 8+ 植物卡双层展示 + 证据等级 + 安全提示 + 来源可点
- [ ] 文化/医学图层标记可点,医学卡有固定免责条
- [ ] 历史路线弧线 + "示意"标注
- [ ] 搜索中英文均可命中;界面语言切换即时生效
- [ ] 移动端:底部抽屉;无横向滚动
- [ ] 减少动态:系统模拟 + 设置开关均生效
- [ ] 三档画质切换不报错;节能档可感知差异
- [ ] 键盘:空格/Esc/R/F;aria-live 有播报
- [ ] 全部示例数据带"待审核"徽章;无来源数据为 0
- [ ] 不出现:剂量/疗效承诺/购买链接/"神秘原始"措辞/虚构来源

---

## 9. 开源材料

- `LICENSE`:MIT(仅代码);`NOTICE.md`:说明图片为 AI 生成的示意插画、
  数据为未审核示例、地理数据来自 Natural Earth(公共领域)
- `README.md`(en)+ `README.zh-CN.md`:愿景、截图位、快速开始、
  数据与合规声明、路线图(MVP→数据工程→全球扩展)、贡献指南链接
- `.env.example`:`VITE_APP_TITLE=`、`VITE_DEFAULT_LOCALE=zh`(占位即可)
