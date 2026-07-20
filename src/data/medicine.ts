/**
 * 传统医学体系示例数据(≥4)——
 * 硬要求:历史文化记录与现代证据分区呈现;不作疗效承诺;
 * 不给出剂量/制备步骤;全部 reviewStatus: 'draft'。
 * 页面呈现时顶部必须固定科普免责说明(DisclaimerBar)。
 */
import type { MedicalTradition } from '@/types';

export const medicine: MedicalTradition[] = [
  {
    id: 'tcm',
    names: { zh: '中医药', en: 'Traditional Chinese Medicine (TCM)' },
    regionsText: {
      zh: '发源于中国,历史上传播至东亚、东南亚多地,当代在全球多国以不同法律地位实践。',
      en: 'Originating in China and historically spreading across East and Southeast Asia; practiced worldwide today under varying legal frameworks.',
    },
    history: {
      zh: '《黄帝内经》《神农本草经》《伤寒杂病论》《本草纲目》等文献记录了其两千余年的知识积累过程;历代本草著作不断增补修订药物记载。',
      en: 'Texts such as the Huangdi Neijing, Shennong Bencao Jing, Shanghan Lun and Bencao Gangmu document two millennia of accumulated knowledge, with materia medica literature revised across dynasties.',
    },
    philosophy: {
      zh: '传统理论以阴阳、五行、气血、脏腑等概念组织对人体与季节、饮食、环境关系的理解,强调"天人相应"的整体观。',
      en: 'Traditional theory organizes understanding of the body, seasons, diet and environment through concepts of yin–yang, the five phases, qi–blood and the organ systems, emphasizing a holistic view of humans within nature.',
    },
    practices: {
      zh: '历史与当代实践中包括草药方剂、针灸、推拿、食疗与节气养生等;本网站仅作文化概述,不提供任何方剂组成与使用方法。',
      en: 'Historic and contemporary practice includes herbal formulas, acupuncture, tuina massage, food therapy and seasonal regimens. This site offers cultural overview only — no formula compositions or usage instructions.',
    },
    modernEvidence: {
      zh: '现代研究覆盖部分单味药的化学成分与药理作用;针灸在部分疼痛适应症上有较充分的随机对照试验证据;多数传统复方的临床证据仍有限或存在争议。青蒿素的发现被视为从古典文献中发掘现代药物的代表案例。',
      en: 'Modern research covers phytochemistry and pharmacology of some single herbs; acupuncture has relatively robust RCT evidence for certain pain conditions; evidence for most classical formulas remains limited or contested. The discovery of artemisinin is a landmark case of a modern drug derived from classical records.',
    },
    evidenceLevel: 'C',
    safetyAndRegulation: {
      zh: '在中国,中医药由《中华人民共和国中医药法》规范,饮片与中成药需符合《中国药典》标准;部分药材含毒性成分(如马兜铃酸类)已被多国限制;任何使用应咨询合格执业医师。',
      en: 'In China, TCM is regulated under the TCM Law, with decoction pieces and patent products required to meet Chinese Pharmacopoeia standards; some herbs contain toxic constituents (e.g., aristolochic acids) restricted in many countries. Consult a licensed practitioner for any use.',
    },
    sourceIds: ['chp', 'who-tm', 'pubmed'],
    reviewStatus: 'draft',
  },
  {
    id: 'tibetan-medicine',
    names: { zh: '藏医药', en: 'Tibetan Medicine (Sowa Rigpa)' },
    regionsText: {
      zh: '主要流传于青藏高原及喜马拉雅周边地区,包括中国西藏、青海、四川、云南、甘肃,以及印度、尼泊尔、不丹、蒙古国的部分地区。',
      en: 'Practiced across the Qinghai–Tibet Plateau and the Himalayan region — Xizang, Qinghai, Sichuan, Yunnan and Gansu in China, and parts of India, Nepal, Bhutan and Mongolia.',
    },
    history: {
      zh: '公元8世纪前后成书的《四部医典》是其奠基性文献,融合了高原本土经验与周边医学传统的交流成果;藏医药浴法被列入联合国教科文组织人类非遗代表作名录。',
      en: 'The Four Medical Tantras (rGyud bzhi), compiled around the 8th century, are its foundational text, synthesizing plateau experience with exchanges from neighboring medical traditions; the Lum medicinal bathing of Sowa Rigpa is inscribed on UNESCO’s Representative List of Intangible Cultural Heritage.',
    },
    philosophy: {
      zh: '传统理论以隆(风)、赤巴(火)、培根(水与土)三因素解释生理与病理,并将饮食、行为、季节与环境纳入同一平衡框架。',
      en: 'Traditional theory explains physiology and illness through three factors — rLung (wind), mKhris-pa (fire) and Bad-kan (water/earth) — placing diet, behavior, season and environment in one balance framework.',
    },
    practices: {
      zh: '历史与当代实践包括高原植物药、药浴、饮食与起居调节、外治法等;本网站仅作文化概述,不提供任何药物使用信息。',
      en: 'Historic and contemporary practice includes highland plant materia medica, medicinal bathing, dietary and lifestyle regulation, and external therapies. Cultural overview only — no usage information.',
    },
    modernEvidence: {
      zh: '现代研究集中在部分高原植物的化学成分与适应原样作用上(如红景天属),多数为实验室与动物研究,人体证据总体有限;部分传统配方中使用的矿物成分存在重金属安全争议。',
      en: 'Modern research focuses on phytochemistry and adaptogen-like effects of some plateau plants (e.g., Rhodiola), mostly preclinical; human evidence remains limited overall, and mineral ingredients in some traditional formulas raise heavy-metal safety concerns.',
    },
    evidenceLevel: 'D',
    safetyAndRegulation: {
      zh: '在中国,藏医药医疗机构与藏药生产纳入国家医药管理体系,部分制剂有国家标准;涉及濒危物种(如冬虫夏草)的材料存在保护与可持续采集问题,野生资源不可随意采集。',
      en: 'In China, Tibetan-medicine institutions and products are integrated into the national regulatory system with state standards for some preparations; materials involving endangered species (e.g., caterpillar fungus) raise conservation and sustainability concerns — wild resources must not be harvested casually.',
    },
    sourceIds: ['unesco-ich', 'who-tm', 'pubmed'],
    reviewStatus: 'draft',
  },
  {
    id: 'dai-medicine',
    names: { zh: '傣医药', en: 'Dai Medicine' },
    regionsText: {
      zh: '主要流传于云南西双版纳、德宏等傣族聚居区,与东南亚泰、老、缅相关传统存在历史联系。',
      en: 'Practiced in Dai areas of Xishuangbanna and Dehong, Yunnan, historically connected to related traditions in Thailand, Laos and Myanmar.',
    },
    history: {
      zh: '贝叶经文献中保存了大量地方性医药记录;20 世纪 80 年代以来,当地开展了系统的文献整理与机构建设。',
      en: 'Palm-leaf manuscripts preserve extensive local medical records; systematic documentation and institutional building have proceeded since the 1980s.',
    },
    philosophy: {
      zh: '传统理论以"四塔"(风、火、水、土)平衡解释人体健康,并把季节与居住环境视为平衡的重要变量。',
      en: 'Traditional theory explains health through the balance of the "four elements" (wind, fire, water, earth), treating season and habitat as key variables.',
    },
    practices: {
      zh: '历史与当代实践包括热带植物药、熏蒸、药浴与饮食调节;本网站仅作文化概述,不提供任何使用信息。',
      en: 'Practice includes tropical plant remedies, fumigation, medicinal bathing and dietary regulation. Cultural overview only — no usage information.',
    },
    modernEvidence: {
      zh: '对部分傣药常用植物(如肾茶等)有初步化学成分研究,临床证据总体缺乏;相关研究多发表于地方性研究机构。',
      en: 'Preliminary phytochemical studies exist for some commonly used Dai medicinal plants (e.g., Orthosiphon); clinical evidence is generally lacking, with research mostly from regional institutes.',
    },
    evidenceLevel: 'E',
    safetyAndRegulation: {
      zh: '傣医药医疗机构纳入地方卫生管理体系;热带植物种类繁多,误认风险较高,任何采集与使用需由合格机构指导。',
      en: 'Dai-medicine institutions operate within the local health system; high tropical plant diversity creates real misidentification risk — collection and use should be guided by qualified institutions.',
    },
    sourceIds: ['who-tm', 'flora-of-china'],
    reviewStatus: 'draft',
  },
  {
    id: 'ayurveda',
    names: { zh: '阿育吠陀', en: 'Ayurveda' },
    regionsText: {
      zh: '发源于印度次大陆,在斯里兰卡、尼泊尔及全球多地实践;印度设有专门的传统医学管理部门。',
      en: 'Originating in the Indian subcontinent and practiced in Sri Lanka, Nepal and worldwide; India maintains a dedicated ministry (AYUSH) for traditional systems.',
    },
    history: {
      zh: '《遮罗迦集》《妙闻集》等梵文经典记录了其早期理论体系;历经两千余年发展,形成完整的教育与行医传统。',
      en: 'Sanskrit classics such as the Charaka Samhita and Sushruta Samhita record its early theory; over two millennia it developed full educational and practice traditions.',
    },
    philosophy: {
      zh: '传统理论以三种"督夏"(vata、pitta、kapha)描述体质与失衡,强调饮食、季节与日常节律的调整。',
      en: 'Traditional theory describes constitution and imbalance through three doshas (vata, pitta, kapha), emphasizing diet, season and daily rhythm.',
    },
    practices: {
      zh: '历史与当代实践包括草药、矿物制剂、油疗、瑜伽与饮食管理;本网站仅作文化概述,不提供任何使用信息。',
      en: 'Practice includes herbal and mineral preparations, oil therapies, yoga and dietary management. Cultural overview only — no usage information.',
    },
    modernEvidence: {
      zh: '对部分常用植物(如姜黄、睡茄)有较丰富的实验室与初步临床研究,整体证据强度不一;多国监管机构曾通报部分阿育吠陀产品的重金属超标问题。',
      en: 'Some widely used plants (turmeric, ashwagandha) have substantial preclinical and preliminary clinical research, though overall evidence strength varies; regulators in several countries have reported heavy-metal contamination in some Ayurvedic products.',
    },
    evidenceLevel: 'D',
    safetyAndRegulation: {
      zh: '印度对传统医学实行注册与药典管理;出口产品在欧美多按膳食补充剂或药品不同路径监管;消费者应注意来源可靠性与污染风险。',
      en: 'India regulates traditional medicine through registration and pharmacopoeias; exported products are regulated as supplements or drugs depending on jurisdiction — source reliability and contamination risk deserve attention.',
    },
    sourceIds: ['who-tm', 'nccih', 'pubmed'],
    reviewStatus: 'draft',
  },
];

export const medicineById = (id: string): MedicalTradition | undefined =>
  medicine.find((m) => m.id === id);
