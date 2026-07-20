/**
 * 阶段3 数据工程体系:权威来源注册中心 + 数据集级登记 + 试点候选清单类型。
 *
 * 铁律(需求第一节):
 * - 未核实字段一律填 '待核查' 或留空,禁止猜测;
 * - 来源 id 稳定(kebab-case),永久不变;
 * - 候选项 status 一律 '候选,未发布',完成来源核查(交付17)前不进入发布流程;
 * - 保护等级、授权字段不确定时不得编造。
 */

// ==================== §1 通用枚举 ====================

/** 证据/来源权威等级(复用阶段2 SourceTier) */
export type SourceTier = 'S' | 'A' | 'B' | 'C';

/** 三态回答:授权类字段只允许 是/否/待核查 */
export type TriStateAnswer = '是' | '否' | '待核查';

/** 组织类型(18 类枚举) */
export type OrganizationType =
  | '联合国机构'
  | '国际条约组织'
  | '政府间组织'
  | '国家科研机构'
  | '政府部门'
  | '数据聚合平台'
  | '植物园'
  | '博物馆'
  | '图书馆'
  | '非营利保护组织'
  | '专业学会'
  | '学术出版机构'
  | '公民科学平台'
  | '商业数据库'
  | '研究机构'
  | '标准组织'
  | '社区组织'
  | '其他';

/** 登记项状态 */
export type AuthorityActiveStatus = 'active' | 'deprecated' | '待核查';

// ==================== §2 权威来源注册中心 ====================

/** 权威来源登记(需求第四节字段) */
export interface AuthoritySource {
  /** 稳定 ID(kebab-case),永久不变 */
  id: string;
  /** 机构或数据库官方全名 */
  officialName: string;
  /** 常用缩写,如 GBIF / POWO */
  abbreviatedName?: string;
  /** 组织类型(18 类枚举) */
  organizationType: OrganizationType;
  /** 上级机构,如 FAOSTAT 的上级为 FAO */
  parentOrganization?: string;
  /** 国家或国际范围,如 '美国'、'国际'、'欧盟';不确定填 '待核查' */
  countryOrRegion: string;
  /** 主题领域,如 ['生物分类','保护状态'] */
  subjectDomains: string[];
  /** 官方主页(只用需求文档明确给出的网址) */
  officialHomepage: string;
  /** 具体数据库主页(与机构主页不同的时候填) */
  databaseHomepage?: string;
  /** API 文档地址(仅登记文档明确给出的,如 GBIF techdocs、IUCN api) */
  apiDocumentationUrl?: string;
  /** 数据下载门户 */
  downloadPortalUrl?: string;
  /** 使用条款页面(未核实前留空,不得猜测) */
  termsOfUseUrl?: string;
  /** 许可说明页面(未核实前留空,不得猜测) */
  licenseInformationUrl?: string;
  /** 引用指南页面(仅登记文档明确给出的,如 GBIF citation-guidelines) */
  citationGuideUrl?: string;
  /** 联系页面 */
  contactUrl?: string;
  /** 支持邮箱(未核实前留空) */
  supportEmail?: string;
  /** 权威等级(复用阶段2 SourceTier;公民科学/商业来源不自动判低质量,但须注明数据生成方式) */
  sourceTier: SourceTier;
  /** 权威性依据:一句话说明该机构为何权威(基于需求文档描述) */
  authorityBasis: string;
  /** 更新频率;不确定填 '待核查' */
  updateFrequency: string;
  /** 最近人工核验月份,如 '2026-07' */
  lastVerifiedAt: string;
  /** 下次复核月份,如 '2026-10' */
  nextReviewAt: string;
  /** 登记项状态 */
  activeStatus: AuthorityActiveStatus;
  /** 备注:登记文档给出的强制要求、授权待核查说明等 */
  notes?: string;
}

// ==================== §3 数据集级登记 ====================

/** 数据集状态 */
export type DatasetStatus =
  | '已登记'
  | '授权待确认'
  | '可公开使用'
  | '内部限制使用'
  | '需要书面许可'
  | '禁止使用';

/** 数据集级登记(需求第四节;同一机构不同数据集授权可能不同,必须分别登记) */
export interface DatasetSource {
  /** 稳定 ID(kebab-case) */
  id: string;
  /** 所属权威来源(AuthoritySource.id) */
  authoritySourceId: string;
  /** 数据集名称 */
  datasetTitle: string;
  /** 数据集简介 */
  datasetDescription?: string;
  /** 数据集官方标识符,如 GBIF datasetKey */
  datasetIdentifier?: string;
  /** DOI(禁止虚构;没有就留空) */
  doi?: string;
  /** 数据版本号 */
  version?: string;
  /** 发布日期 */
  publicationDate?: string;
  /** 最近修改日期 */
  lastModifiedDate?: string;
  /** 时间覆盖起 */
  temporalCoverageStart?: string;
  /** 时间覆盖止 */
  temporalCoverageEnd?: string;
  /** 地理覆盖范围,如 '全球' */
  geographicCoverage?: string;
  /** 分类学覆盖范围,如 '植物'、'多界生物' */
  taxonomicCoverage?: string;
  /** 文化覆盖范围 */
  culturalCoverage?: string;
  /** 数据语言 */
  language?: string;
  /** 记录条数(不确定留空,不得编造) */
  recordCount?: number;
  /** 文件格式,如 ['Darwin Core Archive'] */
  fileFormats?: string[];
  /** API 端点(仅登记文档明确给出的) */
  apiEndpoint?: string;
  /** 下载地址 */
  downloadUrl?: string;
  /** 着陆页 */
  landingPageUrl?: string;
  /** 官方要求的标准引用文本 */
  citationText?: string;
  /** 许可名称;不确定填 '待核查' */
  licenseName: string;
  /** 许可文本地址 */
  licenseUrl?: string;
  /** 要求的署名文本 */
  attributionText?: string;
  /** 是否允许商业使用(三态;非营利平台也必须逐条核对) */
  commercialUseAllowed: TriStateAnswer;
  /** 是否允许修改/清洗后使用 */
  derivativesAllowed: TriStateAnswer;
  /** 是否允许再分发 */
  redistributionAllowed: TriStateAnswer;
  /** 是否要求相同方式共享 */
  shareAlikeRequired: TriStateAnswer;
  /** 是否含敏感数据(如濒危物种坐标) */
  dataSensitive: TriStateAnswer;
  /** 是否含个人数据 */
  personalDataPresent: TriStateAnswer;
  /** 是否受社区限制(传统知识等) */
  communityRestricted: TriStateAnswer;
  /** 获取方式,如 'API与下载页' */
  accessMethod: string;
  /** 是否需要注册/鉴权 */
  authenticationRequired: TriStateAnswer;
  /** 更新频率;不确定填 '待核查' */
  updateFrequency: string;
  /** 数据质量与使用注意 */
  dataQualityNotes?: string;
  /** 数据集状态 */
  status: DatasetStatus;
}

// ==================== §10 试点候选清单(交付16) ====================

/** 候选状态:交付16 固定值(全角逗号);未完成来源核查前不得发布 */
export type PilotCandidateStatus = '候选,未发布';

/** 植物候选(需求第三十一节字段) */
export interface PlantCandidate {
  id: string;
  scientificName: string;
  chineseName: string;
  /** 当地名称;不确定写 '待核查' */
  localNames: string;
  /** 入选理由 */
  selectionReason: string;
  /** 生态代表性 */
  ecologicalRepresentativeness: string;
  /** 文化代表性 */
  culturalRepresentativeness: string;
  /** 传统医学关系(只作文化概述,不作功效声称) */
  traditionalMedicineRelation: string;
  /** 保护风险(描述性;具体等级待 IUCN/CITES/国家名录核查,禁止编造) */
  conservationRisk: string;
  /** 候选权威来源(authoritySources.ts 中的真实 id,≥2) */
  candidateSourceIds: string[];
  /** 是否适合制作生长动画 */
  suitableForGrowthAnimation: boolean;
  /** 是否需要隐藏位置(采集压力/敏感物种) */
  needsLocationMasking: boolean;
  status: PilotCandidateStatus;
}

/** 动物候选(需求第三十一节字段) */
export interface AnimalCandidate {
  id: string;
  scientificName: string;
  chineseName: string;
  localNames: string;
  selectionReason: string;
  /** 栖息地 */
  habitat: string;
  /** 季节行为 */
  seasonalBehavior: string;
  /** 生态作用 */
  ecologicalRole: string;
  /** 文化意义 */
  culturalSignificance: string;
  /** 保护状态说明:只写 '待 IUCN/CITES 核查' 或确知的常识性描述并注明待核查 */
  conservationStatusNote: string;
  candidateSourceIds: string[];
  /** 是否适合 3D 动画 */
  suitableFor3DAnimation: boolean;
  needsLocationMasking: boolean;
  status: PilotCandidateStatus;
}

/** 文化主题候选(需求第三十一节字段) */
export interface CultureCandidate {
  id: string;
  /** 文化群体 */
  group: string;
  /** 地区 */
  region: string;
  /** 主题名称 */
  topic: string;
  /** 主题范围(含呈现边界) */
  scope: string;
  /** 当地来源说明(含待补充的未登记来源) */
  localSourceNote: string;
  /** 学术来源说明 */
  academicSourceNote: string;
  /** 官方来源说明 */
  officialSourceNote: string;
  /** 是否需要社区审核 */
  requiresCommunityReview: boolean;
  /** 是否存在敏感内容 */
  hasSensitiveContent: boolean;
  /** 是否适合公开展示(经社区审核后) */
  suitableForPublicDisplay: boolean;
  candidateSourceIds: string[];
  status: PilotCandidateStatus;
}

/** 传统医学 / 保护主题候选(共用结构) */
export interface TopicCandidate {
  id: string;
  kind: '传统医学' | '保护';
  title: string;
  /** 主题范围(含呈现边界) */
  scope: string;
  selectionReason: string;
  candidateSourceIds: string[];
  status: PilotCandidateStatus;
}

/** 候选类别(汇总索引用) */
export type PilotCategory = '植物' | '动物' | '文化主题' | '传统医学主题' | '保护主题';

/** 候选清单汇总索引项 */
export interface PilotCandidateRef {
  category: PilotCategory;
  id: string;
  /** 展示名(中文名/主题名) */
  name: string;
}

/** 复用说明:阶段3 继续沿用阶段1/2 的基础类型 */
