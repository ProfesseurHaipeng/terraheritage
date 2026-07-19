/**
 * 历史传播路线示意数据(≥3)——
 * 硬要求:note 必须注明"示意路线 · 历史推测";path 为简化示意路径点 [纬度, 经度],
 * 不代表精确历史轨迹;关联真实来源机构。
 */
import type { StoryRoute } from '@/types';

export const routes: StoryRoute[] = [
  {
    id: 'silk-road-land',
    names: { zh: '丝绸之路(陆路)', en: 'Silk Road (Overland)' },
    kind: 'trade',
    path: [
      [34.3, 108.9], // 西安
      [36.1, 103.8], // 兰州
      [38.9, 100.4], // 张掖
      [40.1, 94.7], // 敦煌
      [41.8, 86.2], // 焉耆
      [41.4, 79.9], // 阿克苏
      [39.5, 76.0], // 喀什
      [39.7, 67.0], // 撒马尔罕
      [39.1, 55.6], // 木鹿
      [35.7, 51.4], // 德黑兰
      [33.3, 44.4], // 巴格达
      [36.2, 37.1], // 阿勒颇
      [41.0, 29.0], // 君士坦丁堡
    ],
    note: {
      zh: '示意路线 · 历史推测:公元前2世纪起,连接长安与地中海世界的商路网络促进了丝绸、香料、药材与植物的流通,大黄、甘草、肉桂等物品的贸易在多语种文献中均有记录。',
      en: 'Schematic route · historical approximation: from the 2nd century BCE, the network linking Chang’an to the Mediterranean moved silk, spices, medicines and plants; trade in rhubarb, liquorice and cinnamon appears in records in many languages.',
    },
    sourceIds: ['bhl', 'unesco-ich'],
  },
  {
    id: 'silk-road-sea',
    names: { zh: '海上丝绸之路', en: 'Maritime Silk Road' },
    kind: 'trade',
    path: [
      [22.8, 108.3], // 北部湾
      [21.0, 105.8], // 河内
      [16.1, 108.2], // 岘港
      [10.8, 106.7], // 胡志明
      [1.35, 103.8], // 新加坡
      [3.1, 101.7], // 马六甲
      [5.4, 100.3], // 槟城
      [6.9, 79.9], // 科伦坡
      [9.9, 76.3], // 科钦
      [19.1, 72.9], // 孟买
      [23.6, 58.4], // 马斯喀特
      [12.8, 45.0], // 亚丁
      [15.3, 39.8], // 马萨瓦
      [30.0, 31.2], // 开罗
    ],
    note: {
      zh: '示意路线 · 历史推测:公元1千纪以来,连接中国东南沿海与印度洋、红海的海上贸易网络运输了瓷器、香料与药用植物,胡椒、丁香、乳香等物品的流通改变了多地的饮食与医药文化。',
      en: 'Schematic route · historical approximation: since the first millennium CE, sea routes linking China’s southeast coast to the Indian Ocean and Red Sea carried porcelain, spices and medicinal plants; pepper, clove and frankincense reshaped food and healing cultures across regions.',
    },
    sourceIds: ['bhl', 'unesco-ich'],
  },
  {
    id: 'tea-horse-road',
    names: { zh: '茶马古道', en: 'Tea Horse Road' },
    kind: 'historical-spread',
    path: [
      [30.0, 103.0], // 雅安
      [29.9, 102.2], // 康定
      [30.0, 99.1], // 理塘
      [29.7, 97.8], // 巴塘
      [29.7, 95.8], // 芒康
      [29.7, 94.4], // 左贡
      [29.9, 92.1], // 山南
      [29.7, 91.1], // 拉萨
    ],
    note: {
      zh: '示意路线 · 历史推测:唐宋至近代,横断山脉间的茶马互市通道把四川、云南的茶叶运往青藏高原,同时带动马匹、药材与文化交流,是研究高原植物流通的重要线索。',
      en: 'Schematic route · historical approximation: from the Tang–Song era to modern times, tea-horse trade routes across the Hengduan mountains carried Sichuan and Yunnan tea to the plateau, moving horses, medicinal materials and culture along the way.',
    },
    sourceIds: ['bhl', 'flora-of-china'],
  },
  {
    id: 'artemisia-spread',
    names: { zh: '青蒿的知识传播', en: 'Spread of Artemisia Knowledge' },
    kind: 'historical-spread',
    path: [
      [30.6, 104.1], // 成都(早期文献记录地区之一)
      [35.7, 105.0], // 西北本草记录区
      [39.9, 116.4], // 北京(现代研究机构)
      [51.5, -0.1], // 伦敦(国际合作)
      [6.5, 3.4], // 拉各斯(疟疾防治应用地区之一)
    ],
    note: {
      zh: '示意路线 · 历史推测:青蒿入药记载见于《肘后备急方》等中国古典文献;20 世纪青蒿素的发现经国际合作成为抗疟药物,这一过程常被引用为传统文献启发现代药物研究的案例。',
      en: 'Schematic route · historical approximation: Artemisia annua appears in classical Chinese texts such as Zhouhou Beiji Fang; the 20th-century discovery of artemisinin, developed through international collaboration, is often cited as a case of classical records inspiring modern drug research.',
    },
    sourceIds: ['who-tm', 'pubmed', 'bhl'],
  },
];

export const routeById = (id: string): StoryRoute | undefined =>
  routes.find((r) => r.id === id);
