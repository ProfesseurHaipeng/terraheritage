/**
 * 示例国家数据(≥10,含中国深度试点)—— 全部 reviewStatus: 'draft'(示例待审核)。
 * isoId 与 countries.geo.json 的 properties.id(ISO 数字码)对齐。
 */
import type { CountryInfo } from '@/types';

export const countries: CountryInfo[] = [
  {
    isoId: '156',
    names: { zh: '中国', en: 'China' },
    capital: '北京',
    languages: ['汉语', '藏语', '维吾尔语', '彝语', '傣语等'],
    overview: {
      zh: '横跨寒温带到热带的巨大纬度跨度,造就了从青藏高原到热带雨林的完整生态谱系,也是多个传统医学体系的发源地。',
      en: 'Spanning boreal to tropical zones, China holds an entire spectrum of ecosystems from the Qinghai-Tibet Plateau to rainforests, and is the homeland of several medical traditions.',
    },
    ecosystems: ['高原草甸', '亚热带常绿阔叶林', '热带雨林', '温带草原', '荒漠'],
    regionIds: ['yunnan', 'sichuan', 'xizang', 'qinghai'],
    sourceIds: ['powo', 'flora-of-china'],
    reviewStatus: 'draft',
  },
  {
    isoId: '356',
    names: { zh: '印度', en: 'India' },
    capital: '新德里',
    languages: ['印地语', '英语', '梵语等'],
    overview: {
      zh: '喜马拉雅南麓、德干高原与西高止山脉孕育了极高的植物多样性;阿育吠陀传统在此延续了数千年。',
      en: 'The Himalayan foothills, Deccan plateau and Western Ghats nurture exceptional plant diversity; the Ayurvedic tradition has continued here for millennia.',
    },
    ecosystems: ['热带雨林', '旱生林', '高山草甸', ' mangrove 红树林'],
    regionIds: ['kerala'],
    sourceIds: ['powo', 'who-tm'],
    reviewStatus: 'draft',
  },
  {
    isoId: '392',
    names: { zh: '日本', en: 'Japan' },
    capital: '东京',
    languages: ['日语'],
    overview: {
      zh: '南北狭长的列岛跨越亚热带与亚寒带,本土植物区系独特,汉方医学在近代与现代医学体系并行发展。',
      en: 'The long archipelago crosses subtropical to subarctic zones with a distinctive flora; Kampo medicine developed alongside modern healthcare.',
    },
    ecosystems: ['温带落叶林', '亚高山针叶林', '亚热带林'],
    regionIds: [],
    sourceIds: ['powo'],
    reviewStatus: 'draft',
  },
  {
    isoId: '764',
    names: { zh: '泰国', en: 'Thailand' },
    capital: '曼谷',
    languages: ['泰语'],
    overview: {
      zh: '热带季风气候下的湄南河平原与北部山地,是传统泰医学与丰富药用植物文化的家园。',
      en: 'Monsoon-fed plains and northern mountains host traditional Thai medicine and a rich culture of medicinal plants.',
    },
    ecosystems: ['热带季雨林', '山地常绿林', '湿地'],
    regionIds: [],
    sourceIds: ['powo', 'who-tm'],
    reviewStatus: 'draft',
  },
  {
    isoId: '300',
    names: { zh: '希腊', en: 'Greece' },
    capital: '雅典',
    languages: ['希腊语'],
    overview: {
      zh: '地中海气候与山地隔离造就了高比例的特有植物;自古希腊时代起,药草知识就融入日常生活。',
      en: 'Mediterranean climate and mountain isolation produce many endemic plants; herbal knowledge has been part of daily life since antiquity.',
    },
    ecosystems: ['地中海硬叶林', '山地草原'],
    regionIds: [],
    sourceIds: ['powo', 'ema-herbal'],
    reviewStatus: 'draft',
  },
  {
    isoId: '818',
    names: { zh: '埃及', en: 'Egypt' },
    capital: '开罗',
    languages: ['阿拉伯语'],
    overview: {
      zh: '尼罗河谷的冲积绿洲与两侧沙漠形成强烈对比;埃伯斯纸草文献记录了人类最早的药用植物知识之一。',
      en: 'The fertile Nile valley cuts through desert; the Ebers Papyrus records some of humanity’s earliest medicinal plant knowledge.',
    },
    ecosystems: ['河谷绿洲', '荒漠', '湿地三角洲'],
    regionIds: [],
    sourceIds: ['bhl', 'powo'],
    reviewStatus: 'draft',
  },
  {
    isoId: '404',
    names: { zh: '肯尼亚', en: 'Kenya' },
    capital: '内罗毕',
    languages: ['斯瓦希里语', '英语'],
    overview: {
      zh: '东非大裂谷纵贯全境,稀树草原与高山生态系统并存,多个民族保留着丰富的植物利用传统。',
      en: 'The Great Rift Valley runs through savanna and high mountain ecosystems; many communities keep deep plant-use traditions.',
    },
    ecosystems: ['稀树草原', '高山灌丛', '半荒漠'],
    regionIds: [],
    sourceIds: ['gbif', 'powo'],
    reviewStatus: 'draft',
  },
  {
    isoId: '076',
    names: { zh: '巴西', en: 'Brazil' },
    capital: '巴西利亚',
    languages: ['葡萄牙语'],
    overview: {
      zh: '亚马孙雨林是地球上植物多样性最高的地区,原住民的药用植物知识正被逐步记录与研究。',
      en: 'The Amazon rainforest holds the highest plant diversity on Earth; Indigenous medicinal plant knowledge is being documented and studied.',
    },
    ecosystems: ['热带雨林', '塞拉多草原', '大西洋林'],
    regionIds: [],
    sourceIds: ['gbif', 'powo'],
    reviewStatus: 'draft',
  },
  {
    isoId: '604',
    names: { zh: '秘鲁', en: 'Peru' },
    capital: '利马',
    languages: ['西班牙语', '克丘亚语', '艾马拉语'],
    overview: {
      zh: '安第斯山的垂直地带性压缩了从热带到寒带的生态序列,克丘亚传统中的高地植物利用延续至今。',
      en: 'Andean vertical zonation compresses tropical-to-alpine ecosystems; Quechua highland plant traditions continue today.',
    },
    ecosystems: ['高山苔原', '云雾林', '海岸荒漠'],
    regionIds: [],
    sourceIds: ['gbif', 'powo'],
    reviewStatus: 'draft',
  },
  {
    isoId: '124',
    names: { zh: '加拿大', en: 'Canada' },
    capital: '渥太华',
    languages: ['英语', '法语'],
    overview: {
      zh: '广袤的北方森林与苔原储存着大量寒带植物;第一民族的植物知识通过口述传统代代相传。',
      en: 'Vast boreal forests and tundra hold cold-adapted flora; First Nations plant knowledge passes on through oral tradition.',
    },
    ecosystems: ['北方针叶林', '苔原', '温带雨林'],
    regionIds: [],
    sourceIds: ['gbif', 'powo'],
    reviewStatus: 'draft',
  },
];

export const countryByIso = (iso: string): CountryInfo | undefined =>
  countries.find((c) => c.isoId === iso);
