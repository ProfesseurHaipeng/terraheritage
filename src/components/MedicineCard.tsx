/**
 * 传统医学体系卡 —— DESIGN.md §6:顶部固定 DisclaimerBar;
 * 不作疗效承诺、不含购买/治疗引导;UI 不添加任何使用指导类内容。
 */
import { useState } from 'react';
import type { MedicalTradition } from '@/types';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { ReviewBadge } from './Badges';
import DisclaimerBar from './DisclaimerBar';
import SourceDrawer from './SourceDrawer';

export default function MedicineCard({ item }: { item: MedicalTradition }) {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* 顶部固定免责条 */}
      <div className="border-b border-[var(--panel-line)] p-3">
        <DisclaimerBar />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <header>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl leading-7">{item.names.zh}</h2>
            <ReviewBadge status={item.reviewStatus} />
          </div>
          <p className="mt-0.5 text-xs text-paper-faint">{item.names.en}</p>
        </header>

        <section>
          <h3 className="card-section-title">{t('regionsTextLabel')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{item.regionsText[locale]}</p>
        </section>
        <section>
          <h3 className="card-section-title">{t('history')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{item.history[locale]}</p>
        </section>
        <section>
          <h3 className="card-section-title">{t('philosophy')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{item.philosophy[locale]}</p>
        </section>
        <section>
          <h3 className="card-section-title">{t('practices')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{item.practices[locale]}</p>
        </section>
        <section className="rounded-lg border border-[var(--panel-line)] p-3">
          <h3 className="text-sm font-medium text-[var(--science)]">{t('modernResearch')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{item.modernEvidence[locale]}</p>
        </section>
        <section className="rounded-lg border border-[var(--warn)] bg-[rgba(208,128,80,0.08)] p-3">
          <h3 className="text-sm font-medium text-[var(--warn)]">{t('safetyRegulation')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{item.safetyAndRegulation[locale]}</p>
        </section>

        <button
          type="button"
          onClick={() => setSourcesOpen(true)}
          className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {t('viewSources')}({item.sourceIds.length})
        </button>
      </div>

      <SourceDrawer sourceIds={item.sourceIds} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </div>
  );
}
