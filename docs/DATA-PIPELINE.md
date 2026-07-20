# 数据管线说明(阶段3)

## 数据流总览

```
权威来源(authoritySources.ts,机构级 40 条)
  └─ 数据集级登记(datasets.ts,8 条,授权字段三态:是/否/待核查)
       └─ 试点候选清单(pilot/candidates.ts,60 项,status 固定 '候选,未发布')
            └─ 来源核查(交付17)→ 社区审核 → 正式发布流程
基础数据(plants/animals/cities/... 8 组)── sources.ts(来源注册表,S/A/B/C 级)
```

## 登记规则(需求第一、四节)

- 未核实字段一律填 '待核查' 或留空,禁止猜测;禁止虚构 DOI、许可与授权状态。
- 机构级(AuthoritySource)与数据集级(DatasetSource)分别登记:同一机构不同数据集授权可能不同。
- `lastVerifiedAt` / `nextReviewAt` 为人工核验节奏;条款核查归档见 `docs/compliance/`。
- 候选项必须 `candidateSourceIds ≥ 2` 且能在 authoritySources.ts 解析;动植物候选必须有学名。
- 文化主题候选凡 `requiresCommunityReview` 或 `hasSensitiveContent`,必须有呈现边界 scope 与至少一条来源备注。

## 静态门禁

`npm run validate:data`(scripts/validate-data.mjs,esbuild 打包数据层后 dynamic import):

- a. 基础数据 8 组 sourceIds 非空且可解析到 sources.ts;
- b. sources.ts:id 唯一、tier ∈ SABC、accessedAt 非空、url 须 https(http 白名单 flora-of-china/efloras);
- c. id 唯一(基础数据并发录入期重复降级 WARN,需数据负责人去重);
- d. plants evidenceLevel ∈ A-E;animals conservationStatus 非空、来源不足 2 条 WARN;
- e. medicine evidenceLevel 必填 + safetyAndRegulation 中英双语;
- f. authoritySources ≥39、id 唯一,datasets == 8 且 authoritySourceId 可解析;
- g. countries.geo.json 缺失仅 WARN(国家界降级占位);
- h. 候选五数组 20/20/10/5/5、id 唯一、来源 ≥2 且已登记、status 固定值、动植物学名非空、汇总 60;
- i. 文化敏感候选必须有 scope 与来源备注。

退出码:FAIL>0 时为 1。CI 中应置于 build 之后。

## 证据等级(基础数据)

plants/animals/medicine 条目携带 `evidenceLevel: A-E`(A=系统综述/监管文件,E=传统使用记载/专家意见),医学条目必须同时给出 safetyAndRegulation 中英双语,不作疗效夸大。

## 来源红线速查(2026-07-20 核实)

审计归档:`docs/compliance/source-verification-2026-07-20.yaml`(每条结论附官方页面证据)。

- **红线 ① IUCN Red List**:禁止再分发/再许可/转售(含衍生作品);引用须标注版本号,新版本发布后旧版不得继续用 → 仅申请授权+链接回源+引用等级,不批量镜像(见 yaml `iucn-redlist`)。
- **红线 ② Species+/CITES Checklist**:禁止再分发与再许可,商业使用须 UNEP 书面许可 → 仅链接回源+显著署名(见 yaml `cites`)。
- **红线 ③ BirdLife DataZone**:明确禁止爬取与 TDM(含 AI 训练)→ 批量数据只能走申请表(见 yaml `birdlife-datazone`)。
- **eFloras 保守策略**:条款主机失联(HTTP 000),按"保留所有权利"处理:仅链接与事实性名称引用,书面确认前不进发布流程(见 yaml `efloras`)。
- **GBIF DOI 规则**:正式下载自动分配 DOI,引用须含 DOI;深度过滤使用须注册 derived dataset(见 yaml `gbif`)。
- **WHO SA 传染性**:出版物 CC BY-NC-SA 3.0 IGO,平台衍生内容须用普通版 CC BY-NC-SA(IGO 版限条约性国际组织);不覆盖第三方图表(见 yaml `who-tcim`)。
- **POWO 免责声明**:使用须声明 "RBG, Kew cannot warrant the quality or accuracy of the data",不得暗示 Kew 背书(见 yaml `powo`)。
- **PubMed 摘要版权注意**:NLM 元数据公有领域;摘要/图版权归属出版商 → 只链接回记录页+展示 NLM 元数据(见 yaml `pubmed`)。
