/**
 * 来源机构目录 —— 只放真实存在的机构,url 用机构主页 / 数据库首页。
 * accessedAt 统一写构建月份 2026-07。
 */
import type { Source } from '@/types';

export const sources: Source[] = [
  {
    id: 'powo',
    title: 'Plants of the World Online',
    organization: 'Royal Botanic Gardens, Kew',
    url: 'https://powo.science.kew.org/',
    tier: 'S',
    licenseNote: '数据按 Kew 使用条款引用',
    accessedAt: '2026-07',
  },
  {
    id: 'gbif',
    title: 'GBIF: Global Biodiversity Information Facility',
    organization: 'GBIF Secretariat',
    url: 'https://www.gbif.org/',
    tier: 'S',
    licenseNote: 'CC0 / CC-BY 开放数据',
    accessedAt: '2026-07',
  },
  {
    id: 'who-tm',
    title: 'Traditional Medicine Strategy',
    organization: 'World Health Organization',
    url: 'https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine',
    tier: 'S',
    accessedAt: '2026-07',
  },
  {
    id: 'unesco-ich',
    title: 'Intangible Cultural Heritage Lists',
    organization: 'UNESCO',
    url: 'https://ich.unesco.org/',
    tier: 'S',
    accessedAt: '2026-07',
  },
  {
    id: 'iucn-redlist',
    title: 'The IUCN Red List of Threatened Species',
    organization: 'IUCN',
    url: 'https://www.iucnredlist.org/',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'flora-of-china',
    title: 'Flora of China',
    organization: 'Missouri Botanical Garden & Harvard University Herbaria',
    url: 'http://www.efloras.org/flora_page.aspx?flora_id=2',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'bhl',
    title: 'Biodiversity Heritage Library',
    organization: 'BHL Consortium',
    url: 'https://www.biodiversitylibrary.org/',
    tier: 'A',
    licenseNote: '公共领域文献数字化',
    accessedAt: '2026-07',
  },
  {
    id: 'wfo',
    title: 'World Flora Online',
    organization: 'WFO Consortium',
    url: 'https://www.worldfloraonline.org/',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'nccih',
    title: 'National Center for Complementary and Integrative Health',
    organization: 'U.S. National Institutes of Health',
    url: 'https://www.nccih.nih.gov/',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'chp',
    title: '《中华人民共和国药典》',
    organization: '国家药典委员会',
    url: 'https://www.chp.org.cn/',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'ema-herbal',
    title: 'European Union Herbal Monographs',
    organization: 'European Medicines Agency',
    url: 'https://www.ema.europa.eu/en/human-regulatory-overview/herbal-products',
    tier: 'A',
    accessedAt: '2026-07',
  },
  {
    id: 'pubmed',
    title: 'PubMed',
    organization: 'U.S. National Library of Medicine',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    tier: 'A',
    accessedAt: '2026-07',
  },
];

export const sourceById = (id: string): Source | undefined => sources.find((s) => s.id === id);
