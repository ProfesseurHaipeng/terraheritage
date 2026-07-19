# NOTICE — 资产、数据与第三方声明

## 1. 代码
本仓库代码以 MIT 许可证开源(见 LICENSE)。

## 2. 图片资产(public/assets/)
`public/assets/` 下的 9 张图片(logo、首页氛围图、植物插画、文化/医药主题插画)
为 **AI 生成的示意插画**,仅用于演示与排版,不是科学鉴定依据,也不对应任何
真实标本、文献插图或特定民族的艺术作品。如需替换为真实资料图片,请确保
逐一核对版权与授权(参考 docs/DESIGN.md 的 RightsRecord 设计)。

## 3. 内容数据(src/data/)
`src/data/` 下的国家、区域、植物、民族文化、传统医学、历史路线等内容为
**示例数据,全部标记为 `reviewStatus: 'draft'`(待审核)**,仅用于演示产品
形态与信息架构,不构成任何医疗、植物鉴定或文化定义的依据。

- 每条数据关联的来源机构(POWO/Kew、GBIF、WHO、UNESCO、IUCN、Flora of China、
  BHL、WFO、NIH NCCIH、《中国药典》、EMA、PubMed)均为真实存在的公开机构,
  引用仅指向机构主页,不代表这些机构认可本示例内容。
- 敏感物种(如雪莲、冬虫夏草)坐标已按设计模糊到生态区级(`grid50`)。
- 本平台不提供医疗诊断或个人治疗建议;传统使用不等于现代医学证据。

## 4. 地理数据(src/data/geo/countries.geo.json)
国界数据源自 **Natural Earth**(public domain,公有领域),
经 world-atlas TopoJSON 转换、抽稀(约 1.2° 点距)而来。
边界为示意用途,不代表对任何主权或领土主张的政治判断;
行政边界不等于民族、语言或生态边界。

## 5. 第三方依赖
见 package.json。Three.js(MIT)、React(MIT)、Radix UI(MIT)、
Tailwind CSS(MIT)等,各自保留其许可证。
