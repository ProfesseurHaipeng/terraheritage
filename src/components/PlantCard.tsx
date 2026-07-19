/**
 * 植物知识卡 —— DESIGN.md §6 硬要求:
 * 双层分区(文化与历史视角 / 现代证据视角,措辞:传统上被用于…/当地资料记载…);
 * 证据等级徽章 + 安全提示块;不出现疗效承诺、剂量、制备步骤;
 * 拉丁学名 <em> 斜体;敏感物种 SensitiveBadge + 采集警示;"查看来源"打开 SourceDrawer。
 */
import { useState } from 'react';
import type { Plant } from '@/types';
import { MONTH_NAMES, useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { EvidenceBadge, ReviewBadge, SensitiveBadge } from './Badges';
import SourceDrawer from './SourceDrawer';

/** 花期月份数组 → 月份名串(随界面语言) */
function useMonthText(months: number[]): string {
  const locale = useAppStore((s) => s.locale);
  const names = MONTH_NAMES[locale];
  return months
    .slice()
    .sort((a, b) => a - b)
    .map((m) => names[m - 1] ?? String(m))
    .join('、');
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const floweringText = useMonthText(plant.floweringMonths);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {/* 头部:中文名 + 拉丁学名(斜体)+ 当地名 */}
        <header>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl leading-7">{plant.names.zh}</h2>
            <ReviewBadge status={plant.reviewStatus} />
          </div>
          <p className="mt-1 text-sm text-paper-dim">
            <em lang="la">{plant.names.latin}</em>
          </p>
          {plant.names.local && <p className="mt-0.5 text-xs text-paper-faint">{plant.names.local}</p>}
          <p className="mt-0.5 text-xs text-paper-faint">{plant.names.en}</p>
        </header>

        {/* 图片(有 image 字段时) */}
        {plant.image && (
          <img
            src={plant.image}
            alt={plant.names.zh}
            className="h-36 w-full rounded-lg border border-[var(--panel-line)] object-cover"
          />
        )}

        {/* 徽章行 */}
        <div className="flex flex-wrap gap-1.5">
          <EvidenceBadge level={plant.evidenceLevel} />
          <SensitiveBadge level={plant.sensitivity} />
        </div>

        {/* 概览字段 */}
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="card-section-title">{t('familyLabel')}</dt>
            <dd>{plant.family}</dd>
          </div>
          <div>
            <dt className="card-section-title">{t('nativeRange')}</dt>
            <dd className="text-paper-dim">{plant.nativeRangeText[locale]}</dd>
          </div>
          <div>
            <dt className="card-section-title">{t('altitude')}</dt>
            <dd className="text-paper-dim">{plant.altitudeText[locale]}</dd>
          </div>
          <div>
            <dt className="card-section-title">{t('flowering')}</dt>
            <dd className="font-mono text-paper-dim">{floweringText}</dd>
          </div>
        </dl>

        {/* 双层分区 1:文化与历史视角 */}
        <section className="rounded-lg border border-[var(--panel-line)] p-3">
          <h3 className="text-sm font-medium text-[var(--accent)]">{t('culturalView')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{plant.culturalUse[locale]}</p>
        </section>

        {/* 双层分区 2:现代证据视角 */}
        <section className="rounded-lg border border-[var(--panel-line)] p-3">
          <h3 className="text-sm font-medium text-[var(--science)]">{t('scienceView')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{plant.modernEvidence[locale]}</p>
        </section>

        {/* 安全提示块 */}
        <section className="rounded-lg border border-[var(--warn)] bg-[rgba(208,128,80,0.08)] p-3">
          <h3 className="text-sm font-medium text-[var(--warn)]">{t('safetyNotes')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{plant.safetyNotes[locale]}</p>
          {plant.conservationStatus && (
            <p className="mt-1 text-xs text-paper-faint">{plant.conservationStatus}</p>
          )}
        </section>

        <button
          type="button"
          onClick={() => setSourcesOpen(true)}
          className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {t('viewSources')}({plant.sourceIds.length})
        </button>
      </div>

      <SourceDrawer sourceIds={plant.sourceIds} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </div>
  );
}
