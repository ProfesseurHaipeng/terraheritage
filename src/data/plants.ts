/**
 * 植物知识卡(≥8)—— 双层展示:文化视角 + 现代证据视角。
 * 硬要求:每条 ≥1 真实来源;雪莲/冬虫夏草 sensitivity 'grid50' 且安全文案含
 * "不可随意采集,推荐合法人工栽培来源";文化视角统一用
 * "传统上被用于…/当地资料记载…"措辞;全部 reviewStatus: 'draft'。
 */
import type { Plant } from '@/types';

export const plants: Plant[] = [
  {
    id: 'rhodiola',
    names: { zh: '红景天', en: 'Rhodiola', latin: 'Rhodiola rosea', local: '红景天(藏语:索罗玛布)' },
    family: '景天科 Crassulaceae',
    nativeRangeText: {
      zh: '分布于欧亚大陆高寒地带,包括青藏高原、天山、阿尔泰及北极地区。',
      en: 'High-cold regions across Eurasia, including the Qinghai-Tibet Plateau, Tianshan, Altai and the Arctic.',
    },
    distribution: [
      [33.5, 90.0],
      [42.0, 80.0],
      [68.0, 33.0],
    ],
    altitudeText: { zh: '海拔 1800–5600 米的高山流石滩与草甸', en: 'Alpine scree and meadows at 1800–5600 m' },
    floweringMonths: [6, 7, 8],
    harvestingNote: { zh: '秋季采挖根茎,需保留种群以维持更新。', en: 'Rhizomes are dug in autumn; populations must be left to regenerate.' },
    culturalUse: {
      zh: '传统上被用于高原地区的日常滋补;当地资料记载藏民用其根茎煎汤以应对寒冷与疲劳。',
      en: 'Traditionally used as a highland tonic; local records describe decoctions of the rhizome against cold and fatigue.',
    },
    modernEvidence: {
      zh: '现代研究关注其红景天苷等成分与抗疲劳适应原样作用,临床证据仍有限且结果不一致。',
      en: 'Research focuses on salidroside and adaptogen-like anti-fatigue effects; clinical evidence remains limited and inconsistent.',
    },
    evidenceLevel: 'C',
    safetyNotes: {
      zh: '可能引起失眠或兴奋,睡前避免;孕妇与哺乳期缺乏安全数据。',
      en: 'May cause insomnia or agitation — avoid before sleep; safety data lacking in pregnancy and lactation.',
    },
    conservationStatus: 'IUCN:未评估(部分地区资源减少)',
    sensitivity: 'public',
    image: '/assets/plant-rhodiola.jpg',
    sourceIds: ['powo', 'flora-of-china', 'nccih'],
    reviewStatus: 'draft',
  },
  {
    id: 'snowlotus',
    names: { zh: '雪莲', en: 'Snow Lotus', latin: 'Saussurea involucrata', local: '雪莲花(维吾尔语:塔格依力斯)' },
    family: '菊科 Asteraceae',
    nativeRangeText: {
      zh: '中国新疆天山及中亚高山,生于海拔 2400–4000 米的冰渍石缝。',
      en: 'Tianshan and Central Asian high mountains, in glacial rock crevices at 2400–4000 m.',
    },
    distribution: [[43.1, 86.8]],
    altitudeText: { zh: '海拔 2400–4000 米高山流石滩', en: 'Alpine scree at 2400–4000 m' },
    floweringMonths: [7, 8, 9],
    culturalUse: {
      zh: '当地资料记载雪莲在传统上被用于祛寒除湿的民间配方,被视为高山纯洁的象征。',
      en: 'Local records describe traditional use in folk formulas against cold-damp conditions; it symbolizes alpine purity.',
    },
    modernEvidence: {
      zh: '化学成分研究显示含黄酮与苯丙素类,但高质量人体研究缺乏,功效声称多未获证实。',
      en: 'Phytochemical studies report flavonoids and phenylpropanoids, but high-quality human studies are lacking.',
    },
    evidenceLevel: 'E',
    safetyNotes: {
      zh: '野生种群受威胁,不可随意采集,推荐合法人工栽培来源;使用前应咨询专业医师。',
      en: 'Wild populations are threatened — do not harvest from the wild; choose legal cultivated sources and consult a physician.',
    },
    conservationStatus: '中国国家重点保护野生植物(二级)',
    sensitivity: 'grid50',
    image: '/assets/plant-snowlotus.jpg',
    sourceIds: ['powo', 'flora-of-china', 'iucn-redlist'],
    reviewStatus: 'draft',
  },
  {
    id: 'cordyceps',
    names: { zh: '冬虫夏草', en: 'Caterpillar Fungus', latin: 'Ophiocordyceps sinensis', local: '冬虫夏草(藏语:雅扎贡布)' },
    family: '线虫草科 Ophiocordycipitaceae(真菌)',
    nativeRangeText: {
      zh: '青藏高原及周边海拔 3000–5000 米的高寒草甸,寄生于蝙蝠蛾幼虫。',
      en: 'Alpine meadows of the Qinghai-Tibet Plateau at 3000–5000 m, parasitic on ghost moth larvae.',
    },
    distribution: [[33.0, 97.0]],
    altitudeText: { zh: '海拔 3000–5000 米高寒草甸', en: 'Alpine meadows at 3000–5000 m' },
    floweringMonths: [5, 6, 7],
    culturalUse: {
      zh: '传统上被用于藏医与中医的经典配伍;当地资料记载牧民以其泡酒或炖汤作为高原滋补。',
      en: 'Traditionally used in classic Tibetan and Chinese formulas; herders brew or stew it as a highland tonic.',
    },
    modernEvidence: {
      zh: '虫草素等成分在实验室研究中显示多种活性,但人体临床证据不足;且野生品存在砷超标风险。',
      en: 'Cordycepin shows varied activity in lab studies, but human clinical evidence is insufficient; wild products risk arsenic excess.',
    },
    evidenceLevel: 'D',
    safetyNotes: {
      zh: '野生资源极度稀缺,不可随意采集,推荐合法人工栽培来源;警惕重金属超标与假冒产品。',
      en: 'Wild stocks are extremely scarce — do not harvest from the wild; choose legal cultivated sources; beware heavy metals and counterfeits.',
    },
    conservationStatus: 'IUCN:易危(VU)',
    sensitivity: 'grid50',
    image: '/assets/plant-cordyceps.jpg',
    sourceIds: ['iucn-redlist', 'flora-of-china', 'pubmed'],
    reviewStatus: 'draft',
  },
  {
    id: 'notoginseng',
    names: { zh: '三七', en: 'Notoginseng', latin: 'Panax notoginseng', local: '三七(云南文山)' },
    family: '五加科 Araliaceae',
    nativeRangeText: {
      zh: '中国云南文山及广西西南部,现已广泛人工栽培。',
      en: 'Wenshan (Yunnan) and southwest Guangxi; now widely cultivated.',
    },
    distribution: [[23.4, 104.2]],
    altitudeText: { zh: '海拔 800–1800 米山地林下', en: 'Mountain forest understory at 800–1800 m' },
    floweringMonths: [7, 8],
    culturalUse: {
      zh: '传统上被用于跌打损伤与止血;当地资料记载文山民间以三七根研粉外用。',
      en: 'Traditionally used for bruises and bleeding; Wenshan folk records describe powdered root applied externally.',
    },
    modernEvidence: {
      zh: '三七总皂苷的药理研究较多,口服制剂在部分国家作为传统药物管理;证据质量参差。',
      en: 'Notoginseng saponins are well studied pharmacologically; regulated as a traditional medicine in some countries; evidence quality varies.',
    },
    evidenceLevel: 'C',
    safetyNotes: {
      zh: '可能增加出血风险,手术前与服用抗凝药者应避免;遵医嘱使用。',
      en: 'May increase bleeding risk — avoid before surgery and with anticoagulants; use under medical guidance.',
    },
    sensitivity: 'public',
    image: '/assets/plant-notoginseng.jpg',
    sourceIds: ['chp', 'pubmed'],
    reviewStatus: 'draft',
  },
  {
    id: 'ginkgo',
    names: { zh: '银杏', en: 'Ginkgo', latin: 'Ginkgo biloba' },
    family: '银杏科 Ginkgoaceae',
    nativeRangeText: {
      zh: '中国特有孑遗树种,野生种群仅存于浙江天目山等地,全球广泛栽培。',
      en: 'A relict species endemic to China; wild populations persist around Tianmu Mountain, widely planted worldwide.',
    },
    distribution: [
      [30.3, 119.4],
      [48.8, 2.3],
    ],
    altitudeText: { zh: '海拔 500–1000 米山谷', en: 'Valleys at 500–1000 m' },
    floweringMonths: [4, 5],
    culturalUse: {
      zh: '传统上被用于止咳平喘;寺院古银杏被视为活的文物,承载着地方记忆。',
      en: 'Traditionally used for coughs; ancient temple ginkgos are living relics carrying local memory.',
    },
    modernEvidence: {
      zh: '银杏叶提取物是研究最多的植物药之一;对认知障碍的疗效证据不一致,EMA 有传统使用专论。',
      en: 'Leaf extract is among the most-studied botanicals; evidence for cognitive impairment is inconsistent; EMA lists a traditional-use monograph.',
    },
    evidenceLevel: 'B',
    safetyNotes: {
      zh: '生白果有毒不可多食;叶提取物可能增加出血风险。',
      en: 'Raw seeds are toxic; leaf extract may increase bleeding risk.',
    },
    conservationStatus: 'IUCN:濒危(EN,野生种群)',
    sensitivity: 'public',
    sourceIds: ['powo', 'ema-herbal', 'iucn-redlist'],
    reviewStatus: 'draft',
  },
  {
    id: 'saffron',
    names: { zh: '藏红花', en: 'Saffron', latin: 'Crocus sativus', local: 'زعفران(波斯语)' },
    family: '鸢尾科 Iridaceae',
    nativeRangeText: {
      zh: '起源于地中海东岸与西亚,今伊朗、克什米尔、西班牙为主要产区,中国西藏有引种。',
      en: 'Originating in the eastern Mediterranean and West Asia; Iran, Kashmir and Spain are major producers; introduced to Xizang, China.',
    },
    distribution: [
      [32.0, 53.7],
      [34.0, 74.8],
      [39.4, -3.0],
    ],
    altitudeText: { zh: '海拔 1500–2500 米旱作农田', en: 'Dry farmland at 1500–2500 m' },
    floweringMonths: [10, 11],
    culturalUse: {
      zh: '当地资料记载藏红花沿丝绸之路东传,传统上被用于染料、香料与药膳,是贸易史上的传奇商品。',
      en: 'Records trace saffron eastward along the Silk Road; traditionally used as dye, spice and in medicinal cuisine.',
    },
    modernEvidence: {
      zh: '小规模临床试验提示对情绪有轻度正向作用,但样本量小,尚需更大研究确认。',
      en: 'Small trials suggest mild benefit for mood, but sample sizes are small; larger studies needed.',
    },
    evidenceLevel: 'C',
    safetyNotes: {
      zh: '大剂量有毒性(5g 以上风险显著);掺假常见,需可靠来源。',
      en: 'Toxic in large doses (notably above 5 g); adulteration is common — reliable sourcing matters.',
    },
    sensitivity: 'public',
    sourceIds: ['powo', 'ema-herbal'],
    reviewStatus: 'draft',
  },
  {
    id: 'qinghao',
    names: { zh: '青蒿', en: 'Sweet Wormwood', latin: 'Artemisia annua' },
    family: '菊科 Asteraceae',
    nativeRangeText: {
      zh: '原产于中国及越南北部,现广布温带与亚热带,栽培于非洲多地用于抗疟生产。',
      en: 'Native to China and northern Vietnam, now widespread; cultivated across Africa for antimalarial production.',
    },
    distribution: [
      [29.5, 106.5],
      [21.0, 105.8],
      [-2.0, 30.0],
    ],
    altitudeText: { zh: '海拔 300–1500 米旷野与路旁', en: 'Open ground and roadsides at 300–1500 m' },
    floweringMonths: [8, 9, 10],
    culturalUse: {
      zh: '当地资料记载东晋《肘后备急方》以青蒿绞汁治疟;这一记载启发了 20 世纪青蒿素的发现。',
      en: 'The 4th-century Handbook of Prescriptions for Emergencies records qinghao juice for malaria — the clue that led to artemisinin.',
    },
    modernEvidence: {
      zh: '青蒿素联合疗法(ACT)是 WHO 推荐的疟疾标准治疗方案,拯救了数百万生命,是植物药现代化的里程碑。',
      en: 'Artemisinin combination therapy is the WHO-recommended standard for malaria, saving millions of lives — a landmark of botanical drug development.',
    },
    evidenceLevel: 'A',
    safetyNotes: {
      zh: '青蒿素类药物为处方药,须在医疗机构指导下使用;自行用草药治疟危险且无效。',
      en: 'Artemisinin drugs are prescription-only; self-treating malaria with herbs is dangerous and ineffective.',
    },
    sensitivity: 'public',
    sourceIds: ['who-tm', 'pubmed', 'flora-of-china'],
    reviewStatus: 'draft',
  },
  {
    id: 'licorice',
    names: { zh: '甘草', en: 'Liquorice', latin: 'Glycyrrhiza uralensis' },
    family: '豆科 Fabaceae',
    nativeRangeText: {
      zh: '中国北方、蒙古及中亚干旱半干旱地区,沙地与草原常见。',
      en: 'Arid and semi-arid regions of northern China, Mongolia and Central Asia, on sandy steppe.',
    },
    distribution: [
      [40.5, 110.0],
      [47.0, 105.0],
    ],
    altitudeText: { zh: '海拔 400–2700 米沙质草原', en: 'Sandy steppe at 400–2700 m' },
    floweringMonths: [6, 7, 8],
    culturalUse: {
      zh: '传统上被用于调和诸药,有"国老"之称;当地资料记载其在中亚商路上作为甜味剂与药材流通。',
      en: 'Traditionally used to harmonize formulas — the "elder statesman" of herbs; traded along Central Asian routes as sweetener and medicine.',
    },
    modernEvidence: {
      zh: '甘草酸制剂在日本等国被批准用于肝病辅助治疗;欧盟有传统草药专论;长期大量摄入可致假性醛固酮增多症。',
      en: 'Glycyrrhizin preparations are approved for liver-disease support in Japan and elsewhere; EMA has a monograph; chronic high intake can cause pseudoaldosteronism.',
    },
    evidenceLevel: 'B',
    safetyNotes: {
      zh: '高血压、低血钾患者与孕妇慎用;不宜长期大剂量服用。',
      en: 'Caution in hypertension, hypokalemia and pregnancy; avoid prolonged high doses.',
    },
    sensitivity: 'public',
    sourceIds: ['chp', 'ema-herbal', 'powo'],
    reviewStatus: 'draft',
  },
];

export const plantById = (id: string): Plant | undefined => plants.find((p) => p.id === id);
