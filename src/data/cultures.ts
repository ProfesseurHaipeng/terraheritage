/**
 * 民族文化群体示例数据(≥6,中国西南与青藏高原试点)——
 * 硬要求:必须含现代生活段;禁用猎奇化措辞;全部 reviewStatus: 'draft'。
 * 说明:areas 为主要分布示意点,不代表排他性领土边界(文化边界按规范为渐变不确定边界)。
 */
import type { CulturalGroup } from '@/types';

export const cultures: CulturalGroup[] = [
  {
    id: 'tibetan',
    names: { zh: '藏族', en: 'Tibetan people' },
    selfName: '博巴( bod pa )',
    areas: [
      [31.1, 88.3],
      [33.0, 97.0],
      [28.3, 89.6],
    ],
    languageText: {
      zh: '主要使用藏语(属汉藏语系藏缅语族),有卫藏、康巴、安多等主要方言;藏文有悠久的书面传统。',
      en: 'Tibetan (Tibeto-Burman branch) with Ü-Tsang, Kham and Amdo dialects; a long literary tradition in the Tibetan script.',
    },
    overview: {
      zh: '主要分布在青藏高原及周边地区,其传统知识体系与高原生态紧密相连,涵盖物候观察、草场管理、高原农业与藏医药文化。',
      en: 'Living mainly across the Qinghai–Tibet Plateau and neighboring highlands, Tibetan communities maintain knowledge systems tied to high-altitude ecology: phenology, pasture management, highland agriculture and Tibetan medical culture.',
    },
    modernLife: {
      zh: '当代藏族人口生活在西藏自治区及青海、四川、云南、甘肃等省区的城镇与乡村,从事教育、旅游、现代农业、文创与数字经济等多种职业;藏文出版、双语教育和非遗记录工程持续开展。',
      en: 'Today Tibetans live in towns and villages across Xizang Autonomous Region and Qinghai, Sichuan, Yunnan and Gansu provinces, working in education, tourism, modern agriculture, cultural industries and the digital economy; Tibetan-language publishing, bilingual schooling and heritage documentation continue.',
    },
    traditions: {
      zh: '传统上,酥油茶与青稞是高原饮食的核心;《四部医典》等文献记录了当地的医学知识;多地保留与山水相关的生态禁忌与节庆,体现了人与自然长期相处的经验。',
      en: 'Traditionally, butter tea and highland barley anchor the plateau diet; texts such as the Four Medical Tantras record local medical knowledge; ecological customs and festivals tied to mountains and lakes reflect long experience of living with the land.',
    },
    sourceIds: ['unesco-ich', 'bhl'],
    reviewStatus: 'draft',
  },
  {
    id: 'yi',
    names: { zh: '彝族', en: 'Yi people' },
    selfName: '诺苏 / 尼苏( Nuosu / Nisu )',
    areas: [
      [27.9, 102.3],
      [25.0, 101.9],
      [26.6, 104.8],
    ],
    languageText: {
      zh: '使用彝语(汉藏语系彝语支),有六大方言;彝文是历史悠久的音节文字,文献数量可观。',
      en: 'Yi (Loloish branch) with six major dialects; the Yi script is a historic syllabary with a substantial manuscript corpus.',
    },
    overview: {
      zh: '主要分布在四川、云南、贵州和广西的山区,长期在垂直气候带中经营农林复合生计,积累了丰富的植物识别与利用经验,如火把节等节庆与物候紧密相关。',
      en: 'Concentrated in the mountains of Sichuan, Yunnan, Guizhou and Guangxi, Yi communities have long farmed and gathered across vertical climate belts, building rich plant knowledge; festivals such as the Torch Festival track the phenological calendar.',
    },
    modernLife: {
      zh: '当代彝族人口参与多样化的现代生计:特色农业、生态旅游、彝绣等手工艺产业化、外出务工与返乡创业并存;彝文古籍数字化和地方志编纂持续推进。',
      en: 'Modern Yi livelihoods are diverse: specialty agriculture, eco-tourism, commercialized crafts such as Yi embroidery, migrant work and returnee entrepreneurship; digitization of Yi manuscripts and local gazetteers is ongoing.',
    },
    traditions: {
      zh: '当地资料记载了以苦荞、燕麦为代表的高山作物传统;毕摩文献中包含大量关于植物、动物与疾病认知的记录,是研究当地知识体系的重要资料。',
      en: 'Local records document highland crops such as bitter buckwheat and oats; Bimo ritual manuscripts contain extensive records of plant, animal and illness knowledge — key sources for studying these knowledge systems.',
    },
    sourceIds: ['unesco-ich', 'bhl'],
    reviewStatus: 'draft',
  },
  {
    id: 'dai',
    names: { zh: '傣族', en: 'Dai people' },
    selfName: '傣( tai )',
    areas: [
      [21.9, 100.8],
      [24.4, 98.6],
    ],
    languageText: {
      zh: '使用傣语(属壮侗语族),有傣泐文、傣那文等传统文字,与东南亚泰语诸语言关系密切。',
      en: 'Dai (Kra–Dai family) with traditional scripts such as Tai Lüe and Tai Nuea, closely related to the Tai languages of Southeast Asia.',
    },
    overview: {
      zh: '主要分布在云南西双版纳、德宏等地的河谷与坝区,稻作农业与热带植物利用传统深厚;泼水节(傣历新年)与雨季节律相呼应。',
      en: 'Mainly in the valleys of Xishuangbanna and Dehong, Yunnan, Dai communities have deep traditions of paddy agriculture and tropical plant use; the Water-Splashing Festival (Dai New Year) follows the monsoon rhythm.',
    },
    modernLife: {
      zh: '当代傣族地区是热带作物(橡胶、茶叶、热带水果)的重要产区,旅游与边境贸易活跃;傣医药医疗机构与研究机构在州级层面运行,传统文字教育进入部分学校课程。',
      en: 'Dai regions today are major producers of rubber, tea and tropical fruit, with active tourism and border trade; Dai-medicine hospitals and research institutes operate at prefecture level, and traditional-script classes enter some school curricula.',
    },
    traditions: {
      zh: '当地资料记载了以"四塔"观念组织的风、土、水、火平衡理念,以及与之相应的植物利用与饮食传统;贝叶经文献保存了大量地方性知识。',
      en: 'Local records describe a balance of wind, earth, water and fire (the "four elements") organizing plant use and diet; palm-leaf manuscripts preserve extensive local knowledge.',
    },
    sourceIds: ['unesco-ich', 'who-tm'],
    reviewStatus: 'draft',
  },
  {
    id: 'bai',
    names: { zh: '白族', en: 'Bai people' },
    selfName: '白子 / 白尼( Baipzix / Baipni )',
    areas: [
      [25.6, 100.2],
      [26.1, 99.9],
    ],
    languageText: {
      zh: '使用白语(汉藏语系,系属学界尚有讨论),通用汉文;历史上有借用汉字记录白语的传统。',
      en: 'Bai (Sino-Tibetan; exact affiliation debated), with widespread Chinese literacy and a history of writing Bai with Chinese characters.',
    },
    overview: {
      zh: '主要分布在云南大理白族自治州,苍山洱海之间的坝区农业与渔业历史悠久,扎染、木雕等手工艺与本地植物染料的使用密切相关。',
      en: 'Centered in Dali Bai Autonomous Prefecture, Yunnan, between the Cangshan mountains and Erhai lake; long traditions of basin farming and fishing, with tie-dye and woodcarving crafts linked to local dye plants.',
    },
    modernLife: {
      zh: '当代白族聚居区旅游业、乳业与特色种植(如核桃、梅子)发达,传统村落保护与扎染等非遗技艺的产业化并行推进。',
      en: 'Tourism, dairy and specialty crops (walnuts, plums) anchor the modern economy of Bai areas, alongside village conservation and the commercialization of heritage crafts like tie-dye.',
    },
    traditions: {
      zh: '当地资料记载了以板蓝(马蓝)等植物为靛蓝染料的扎染工艺,以及与"三月街"等集市节庆相连的物产交换传统。',
      en: 'Local records document indigo tie-dye using plants such as Baphicacanthus (ma lan), and exchange traditions tied to fairs such as the Third Month Fair.',
    },
    sourceIds: ['unesco-ich', 'powo'],
    reviewStatus: 'draft',
  },
  {
    id: 'hani',
    names: { zh: '哈尼族', en: 'Hani people' },
    selfName: '哈尼( Haqniq )',
    areas: [
      [23.1, 102.8],
      [22.4, 103.4],
    ],
    languageText: {
      zh: '使用哈尼语(汉藏语系彝语支),内部方言差异较大;历史上以汉文为主要书面工具。',
      en: 'Hani (Loloish branch) with considerable internal dialect diversity; Chinese historically served as the main written medium.',
    },
    overview: {
      zh: '主要分布在云南南部哀牢山区,以高山梯田稻作系统闻名——红河哈尼梯田被联合国教科文组织列为世界文化遗产,森林—村寨—梯田—水系"四素同构"的土地利用方式体现了精细的生态管理。',
      en: 'Concentrated in the Ailao mountains of southern Yunnan, Hani communities are known for their terraced rice systems — the Honghe Hani Rice Terraces are a UNESCO World Heritage site, where the forest–village–terrace–water system reflects refined ecological management.',
    },
    modernLife: {
      zh: '当代哈尼族地区在维持梯田稻作的同时发展红米品牌、生态旅游与乡村民宿;梯田灌溉系统的传统管理机制(如"赶沟人")仍在部分村寨运行。',
      en: 'While maintaining terrace farming, Hani areas now develop red-rice brands, eco-tourism and homestays; traditional irrigation management roles (such as ditch keepers) still operate in some villages.',
    },
    traditions: {
      zh: '当地资料记载了与梯田节庆、水源林保护相关的植物知识体系,包括多种野生蔬菜与药用植物的识别传统。',
      en: 'Local records document plant knowledge tied to terrace festivals and watershed-forest protection, including the identification of wild vegetables and medicinal plants.',
    },
    sourceIds: ['unesco-ich', 'flora-of-china'],
    reviewStatus: 'draft',
  },
  {
    id: 'naxi',
    names: { zh: '纳西族', en: 'Naxi people' },
    selfName: '纳西( Naqxi )',
    areas: [
      [26.9, 100.2],
      [27.8, 99.7],
    ],
    languageText: {
      zh: '使用纳西语(汉藏语系),以东巴文(象形文字)与哥巴文记录宗教文献而闻名,丽江古城为世界文化遗产。',
      en: 'Naxi (Sino-Tibetan), renowned for the Dongba pictographic and Geba scripts used in ritual manuscripts; the Old Town of Lijiang is a UNESCO World Heritage site.',
    },
    overview: {
      zh: '主要分布在云南丽江及川滇交界地区,处于横断山脉生物多样性与多条文化通道的交汇处,东巴文献中保存了丰富的自然观与植物记录。',
      en: 'Mainly around Lijiang and the Sichuan–Yunnan border, at the crossroads of Hengduan biodiversity and historic trade corridors; Dongba manuscripts preserve rich records of nature philosophy and plants.',
    },
    modernLife: {
      zh: '当代纳西族地区以旅游业为支柱产业之一,东巴文化传习院、纳西古乐演出与文创产业并存;高山植物园与科研机构在当地开展生物多样性研究。',
      en: 'Tourism now anchors the Naxi regional economy alongside Dongba-culture schools, Naxi ancient-music performances and cultural industries; alpine botanical gardens and research institutes study local biodiversity.',
    },
    traditions: {
      zh: '当地资料记载了对玉龙雪山周边高山植物的利用与保护传统,东巴仪式文献中包含对自然水源、森林的敬畏性表达。',
      en: 'Local records document the use and protection of alpine plants around Jade Dragon Snow Mountain; Dongba ritual texts express reverence for water sources and forests.',
    },
    sourceIds: ['unesco-ich', 'bhl'],
    reviewStatus: 'draft',
  },
];

export const cultureById = (id: string): CulturalGroup | undefined =>
  cultures.find((c) => c.id === id);
