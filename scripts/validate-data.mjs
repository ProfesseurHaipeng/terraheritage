#!/usr/bin/env node
/**
 * 交付16 数据门禁:基础数据 + 权威来源注册中心 + 试点候选清单静态校验。
 * 运行:npm run validate:data(内部用 esbuild 打包 TS 数据层后 dynamic import)。
 * 退出码:存在 FAIL 时为 1;仅 WARN 为 0。
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

let fail = 0, warn = 0;
const FAIL = (m) => { fail++; console.error('FAIL ' + m); };
const WARN = (m) => { warn++; console.warn('WARN ' + m); };

const out = join(mkdtempSync(join(tmpdir(), 'dv-')), 'bundle.mjs');
execFileSync(join('node_modules', '.bin', 'esbuild'), [
  'src/data/index.ts', '--bundle', '--format=esm', '--platform=neutral',
  '--log-level=warning', '--alias:@=./src', '--outfile=' + out,
], { stdio: 'inherit' });
const d = await import(pathToFileURL(out).href);

/* ---- a. 基础数据 8 组:sourceIds 非空且可解析到 sources.ts ---- */
const registryIds = new Set(d.sources.map((s) => s.id));
const groups = [
  ['plants', d.plants], ['animals', d.animals], ['cities', d.cities],
  ['ecosystems', d.ecosystems], ['cultures', d.cultures], ['medicine', d.medicine],
  ['countries', d.countries], ['routes', d.routes],
];
for (const [name, arr] of groups) for (const item of arr) {
  const key = item.id ?? item.isoId;
  const ids = item.sourceIds ?? [];
  if (!ids.length) FAIL(`${name}/${key}: sourceIds 为空`);
  for (const sid of ids) if (!registryIds.has(sid)) FAIL(`${name}/${key}: 未知来源 '${sid}'`);
}

/* ---- b. sources.ts 注册表本身 ---- */
const seenSrc = new Set();
for (const s of d.sources) {
  if (seenSrc.has(s.id)) FAIL(`sources id 重复: ${s.id}`);
  seenSrc.add(s.id);
  if (!/^[SABC]$/.test(s.tier)) FAIL(`sources/${s.id}: tier 非法 '${s.tier}'`);
  if (!s.accessedAt) FAIL(`sources/${s.id}: accessedAt 为空`);
  if (!/^https:\/\//.test(s.url) && !['flora-of-china', 'efloras'].includes(s.id))
    FAIL(`sources/${s.id}: url 非 https`);
}

/* ---- c. id 唯一(基础数据并发录入期存在已知重复,降级 WARN,需数据负责人去重) ---- */
const LEGACY_GROUPS = new Set(['plants', 'animals', 'cities', 'ecosystems', 'cultures', 'medicine', 'countries', 'routes']);
for (const [name, arr] of groups) {
  const seen = new Set();
  for (const item of arr) {
    const key = item.id ?? item.isoId;
    if (seen.has(key)) {
      const m = `${name}: id 重复 '${key}'`;
      if (LEGACY_GROUPS.has(name)) WARN(m + '(基础数据 id 重复,非交付16范围,需数据负责人去重)');
      else FAIL(m);
    }
    seen.add(key);
  }
}

/* ---- d. 重点抽查:plants evidenceLevel / animals conservationStatus ---- */
for (const p of d.plants) if (!/^[A-E]$/.test(p.evidenceLevel ?? '')) FAIL(`plants/${p.id}: evidenceLevel 非法`);
for (const a of d.animals) {
  if (!a.conservationStatus) FAIL(`animals/${a.id}: conservationStatus 为空`);
  if ((a.sourceIds ?? []).length < 2) WARN(`animals/${a.id}: sourceIds 仅 ${(a.sourceIds ?? []).length} 条`);
}

/* ---- e. medicine:evidenceLevel 必填 + safetyAndRegulation 中英非空 ---- */
for (const m of d.medicine) {
  if (!/^[A-E]$/.test(m.evidenceLevel ?? '')) FAIL(`medicine/${m.id}: 缺 evidenceLevel(A-E)`);
  const s = m.safetyAndRegulation ?? {};
  if (!s.zh || !s.en) FAIL(`medicine/${m.id}: safetyAndRegulation 中英双语必填`);
}

/* ---- f. 权威来源注册中心 ---- */
if (d.authoritySources.length < 39) FAIL(`authoritySources 仅 ${d.authoritySources.length} 条(<39)`);
const authIds = new Set();
for (const s of d.authoritySources) {
  if (authIds.has(s.id)) FAIL(`authoritySources id 重复: ${s.id}`);
  authIds.add(s.id);
}
if (d.datasetSources.length !== 8) FAIL(`datasetSources 应为 8 条,实际 ${d.datasetSources.length}`);
for (const ds of d.datasetSources)
  if (!authIds.has(ds.authoritySourceId)) FAIL(`datasetSources/${ds.id}: authoritySourceId '${ds.authoritySourceId}' 无法解析`);

/* ---- g. countries.geo.json(可选,缺失仅 WARN) ---- */
if (!['public/data/countries.geo.json', 'src/data/geo/countries.geo.json', 'dist/data/countries.geo.json'].some(existsSync))
  WARN('countries.geo.json 未找到,国家界降级为占位');

/* ---- h. 试点候选:数量 / id 唯一 / 来源 ≥2 且可解析 / status 固定值 ---- */
const EXP = [
  ['植物', d.plantCandidates, 20], ['动物', d.animalCandidates, 20],
  ['文化', d.cultureCandidates, 10], ['医学主题', d.medicineTopicCandidates, 5],
  ['保护主题', d.conservationTopicCandidates, 5],
];
const seenCand = new Set();
for (const [label, arr, n] of EXP) {
  if (arr.length !== n) FAIL(`${label}候选应 ${n} 条,实际 ${arr.length}`);
  for (const c of arr) {
    if (seenCand.has(c.id)) FAIL(`候选 id 重复: ${c.id}`);
    seenCand.add(c.id);
    const ids = c.candidateSourceIds ?? [];
    if (ids.length < 2) FAIL(`${label}候选/${c.id}: candidateSourceIds 少于 2 条`);
    for (const sid of ids) if (!authIds.has(sid)) FAIL(`${label}候选/${c.id}: 未登记来源 '${sid}'`);
    if (c.status !== '候选,未发布') FAIL(`${label}候选/${c.id}: status 应为 '候选,未发布'`);
    if ((label === '植物' || label === '动物') && !c.scientificName) FAIL(`${label}候选/${c.id}: scientificName 为空`);
  }
}
if (d.pilotCandidates.length !== 60) FAIL(`pilotCandidates 应 60 条,实际 ${d.pilotCandidates.length}`);

/* ---- i. 文化候选:敏感内容必须有呈现边界与来源备注 ---- */
for (const c of d.cultureCandidates) if (c.requiresCommunityReview || c.hasSensitiveContent) {
  if (!(c.scope ?? '').trim()) FAIL(`文化候选/${c.id}: 敏感内容必须填写 scope 呈现边界`);
  if (![c.localSourceNote, c.academicSourceNote, c.officialSourceNote].some((t) => (t ?? '').trim()))
    FAIL(`文化候选/${c.id}: 敏感内容至少填写一条来源备注`);
}

console.log(`数据量: plants=${d.plants.length} animals=${d.animals.length} cities=${d.cities.length} ecosystems=${d.ecosystems.length} cultures=${d.cultures.length} medicine=${d.medicine.length} countries=${d.countries.length} routes=${d.routes.length}`);
console.log(`注册中心: authoritySources=${d.authoritySources.length} datasets=${d.datasetSources.length} sources=${d.sources.length}`);
console.log(`试点候选: 植物=${d.plantCandidates.length} 动物=${d.animalCandidates.length} 文化=${d.cultureCandidates.length} 医学主题=${d.medicineTopicCandidates.length} 保护主题=${d.conservationTopicCandidates.length} 汇总=${d.pilotCandidates.length}`);
console.log(`结果: FAIL ${fail} / WARN ${warn}`);
process.exit(fail ? 1 : 0);
