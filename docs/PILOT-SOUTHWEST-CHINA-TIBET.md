# 试点地区:中国西南与青藏高原(交付16)

> **使用方式注记(2026-07-20 条款核查)**:引用 efloras / iucn-redlist / cites / birdlife-datazone 的候选项均为"引用+链接回源"使用方式,不批量镜像源数据(IUCN/Species+ 禁再分发,BirdLife 禁爬取);引用 efloras 的 7 项候选在来源书面确认完成前不得进入发布流程。依据:docs/compliance/source-verification-2026-07-20.yaml。

## 试点范围与选择逻辑

- 地理范围:青藏高原(西藏、青海南部)与横断山区(川西、滇西北),兼顾高寒草甸/流石滩、高原湿地、亚高山森林三类生态系统。
- 选择逻辑:生态代表性 × 文化代表性 × 数据可得性 × 保护议题价值;传统医学内容一律议题化呈现,不作功效声称(需求第一节)。
- 全部候选 status 固定为"候选,未发布";完成来源核查(交付17)与社区审核前不进入发布流程。

## 候选清单概览(表四,60 项)

| 类别 | 数量 | 文件 | 说明 |
|---|---|---|---|
| 植物 | 20 | `src/data/pilot/candidates.ts` plantCandidates | 含真菌 2(冬虫夏草、松茸)、地衣 1(雪茶);命名人省略,宁缺毋假 |
| 动物 | 20 | 同上 animalCandidates |  mammals 14、鸟类 6;保护等级一律"待 IUCN/CITES 核查" |
| 文化主题 | 10 | 同上 cultureCandidates | 全部需社区审核;神山圣湖主题不公开展示 |
| 传统医学主题 | 5 | 同上 medicineTopicCandidates | 议题式(安全性、伦理、监管、惠益分享),不提供药方 |
| 保护主题 | 5 | 同上 conservationTopicCandidates | 旗舰物种共存、廊道、热点、气候物候 |
| 汇总索引 | 60 | 同上 pilotCandidates | 五类合并的 category/id/name 索引 |

## 关键取舍记录

- 天山雪莲(Saussurea involucrata)超出地理范围 → 改选水母雪兔子 S. medusa 与绵头雪兔子 S. laniceps;
- 灵芝非高原代表,剔除;秦艽偏西北 → 改选粗茎秦艽 Gentiana crassicaulis;
- 胡黄连采用修订后属名 Neopicrorhiza scrophulariiflora(旧属名 Picrorhiza);
- 白唇鹿属名 Przewalskium/Cervus 分类争议,留 TaxonResolution 备注;
- 引用 efloras 的 7 项植物候选:条款失联,书面确认前不得发布(见文首注记)。

## 呈现边界通则

- 不提供药方、剂量与用法;不标注敏感物种精确采集位置(needsLocationMasking);
- 宗教仪轨不翻译、不演绎;神山精确位置与朝礼路线未经社区许可不标注;
- 保护等级只写"待 IUCN/CITES 核查",禁止编造;来源引用遵循 docs/DATA-PIPELINE.md 红线速查。
