/**
 * 代表区域数据 —— 中国深度试点(云南/四川/西藏/青海)+ 每国 1–2 个代表区。
 */
import type { Region } from '@/types';

export const regions: Region[] = [
  {
    id: 'yunnan',
    countryIso: '156',
    names: { zh: '云南', en: 'Yunnan' },
    center: [25.0, 101.5],
    overview: {
      zh: '"植物王国":北回归线横穿,从滇西北高山峡谷到西双版纳热带雨林,浓缩了中国的主要植被类型。',
      en: 'A "kingdom of plants": from northwest gorges to Xishuangbanna rainforest, Yunnan compresses most of China’s vegetation types.',
    },
    seasonModel: 'tropical',
  },
  {
    id: 'sichuan',
    countryIso: '156',
    names: { zh: '四川', en: 'Sichuan' },
    center: [30.6, 102.7],
    overview: {
      zh: '盆地与横断山脉交汇,华西雨屏孕育了独特的湿润山地植物区系。',
      en: 'Where basin meets Hengduan mountains, the rain screen nurtures a unique humid montane flora.',
    },
    seasonModel: 'northern',
  },
  {
    id: 'xizang',
    countryIso: '156',
    names: { zh: '西藏', en: 'Xizang (Tibet)' },
    center: [31.1, 88.3],
    overview: {
      zh: '平均海拔 4000 米以上的高原,高寒草甸与垫状植物群落是藏医药文化的生态基础。',
      en: 'A plateau averaging above 4000 m; alpine meadows and cushion plants underpin Tibetan medical culture.',
    },
    seasonModel: 'northern',
  },
  {
    id: 'qinghai',
    countryIso: '156',
    names: { zh: '青海', en: 'Qinghai' },
    center: [35.7, 96.0],
    overview: {
      zh: '三江源所在地,高原湿地与草原是冬虫夏草等敏感物种的栖息地。',
      en: 'Source of three great rivers; plateau wetlands and grasslands habitat sensitive species such as caterpillar fungus.',
    },
    seasonModel: 'northern',
  },
  {
    id: 'kerala',
    countryIso: '356',
    names: { zh: '喀拉拉邦', en: 'Kerala' },
    center: [10.5, 76.2],
    overview: {
      zh: '西高止山脉脚下的湿润热带地区,被视为阿育吠陀传统的重要实践中心之一。',
      en: 'Humid tropics at the foot of the Western Ghats, a major living center of Ayurvedic practice.',
    },
    seasonModel: 'tropical',
  },
  {
    id: 'hokkaido',
    countryIso: '392',
    names: { zh: '北海道', en: 'Hokkaido' },
    center: [43.4, 142.8],
    overview: {
      zh: '亚寒带森林与雪原,阿伊努文化中的植物利用传统独具特色。',
      en: 'Subarctic forests and snowfields; Ainu plant-use traditions are distinctive.',
    },
    seasonModel: 'northern',
  },
  {
    id: 'crete',
    countryIso: '300',
    names: { zh: '克里特岛', en: 'Crete' },
    center: [35.2, 24.9],
    overview: {
      zh: '地中海岛屿特有植物的宝库,民间药草采集传统延续至今。',
      en: 'A treasury of Mediterranean island endemics; folk herb-gathering continues today.',
    },
    seasonModel: 'northern',
  },
  {
    id: 'andes-peru',
    countryIso: '604',
    names: { zh: '秘鲁安第斯', en: 'Peruvian Andes' },
    center: [-13.5, -72.0],
    overview: {
      zh: '垂直生态带从河谷农田直达高山草甸,是美洲重要作物起源地之一。',
      en: 'Vertical belts from valley farms to high meadows; a major center of crop origin.',
    },
    seasonModel: 'tropical',
  },
  {
    id: 'rift-valley',
    countryIso: '404',
    names: { zh: '东非大裂谷(肯尼亚段)', en: 'Rift Valley (Kenya)' },
    center: [-0.5, 36.1],
    overview: {
      zh: '裂谷湖泊与稀树草原镶嵌,干湿季分明的节律塑造了当地的植物利用方式。',
      en: 'Rift lakes mosaic with savanna; a strong wet-dry rhythm shapes local plant use.',
    },
    seasonModel: 'tropical',
  },
  {
    id: 'amazonas',
    countryIso: '076',
    names: { zh: '亚马孙(巴西)', en: 'Amazonas (Brazil)' },
    center: [-4.0, -63.0],
    overview: {
      zh: '地球最大的热带雨林腹地,原住民社群是这片森林知识的主要守护者。',
      en: 'Heart of the largest rainforest; Indigenous communities are its primary knowledge keepers.',
    },
    seasonModel: 'tropical',
  },
  {
    id: 'boreal-canada',
    countryIso: '124',
    names: { zh: '加拿大北方林', en: 'Canadian Boreal Forest' },
    center: [55.0, -105.0],
    overview: {
      zh: '环绕北半球的针叶林带加拿大段,冬季漫长,植物生长季短促而集中。',
      en: 'Canada’s stretch of the circumpolar conifer belt, with long winters and a short intense growing season.',
    },
    seasonModel: 'northern',
  },
];

export const regionById = (id: string): Region | undefined => regions.find((r) => r.id === id);
