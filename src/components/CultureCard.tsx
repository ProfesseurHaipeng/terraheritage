/**
 * 民族文化卡 —— DESIGN.md §6:必须含"现代生活"段;禁用猎奇化措辞。
 */
import { useState } from 'react';
import type { CulturalGroup } from '@/types';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { ReviewBadge } from './Badges';
import SourceDrawer from './SourceDrawer';

export default function CultureCard({ culture }: { culture: CulturalGroup }) {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <header>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl leading-7">{culture.names.zh}</h2>
            <ReviewBadge status={culture.reviewStatus} />
          </div>
          {culture.selfName && (
            <p className="mt-1 text-xs text-paper-faint">
              {t('selfName')}:{culture.selfName}
            </p>
          )}
          <p className="mt-0.5 text-xs text-paper-faint">{culture.names.en}</p>
        </header>

        <section>
          <h3 className="card-section-title">{t('language')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{culture.languageText[locale]}</p>
        </section>

        <section>
          <h3 className="card-section-title">{t('overview')}</h3>
          <p className="text-sm leading-6 text-paper-dim">{culture.overview[locale]}</p>
        </section>

        <section className="rounded-lg border border-[var(--panel-line)] p-3">
          <h3 className="text-sm font-medium text-[var(--accent)]">{t('traditions')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{culture.traditions[locale]}</p>
        </section>

        {/* 现代生活段:必须渲染 */}
        <section className="rounded-lg border border-[var(--panel-line)] p-3">
          <h3 className="text-sm font-medium text-[var(--eco)]">{t('modernLife')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-paper-dim">{culture.modernLife[locale]}</p>
        </section>

        <button
          type="button"
          onClick={() => setSourcesOpen(true)}
          className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {t('viewSources')}({culture.sourceIds.length})
        </button>
      </div>

      <SourceDrawer sourceIds={culture.sourceIds} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </div>
  );
}
