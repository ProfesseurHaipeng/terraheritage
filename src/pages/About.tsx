/**
 * About 页 —— 项目说明:愿景、MVP 范围、数据与审核声明、科普用途声明
 * (DisclaimerBar)、来源机构列表(读 sources)、开源说明。
 */
import { Link } from 'react-router';
import DisclaimerBar from '@/components/DisclaimerBar';
import { TierBadge } from '@/components/Badges';
import { sources } from '@/data';
import { useT } from '@/lib/i18n';

export default function About() {
  const t = useT();

  return (
    <div className="min-h-full overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
        <header>
          <h1 className="font-display text-3xl">{t('about')} · TerraHeritage 万物本草</h1>
        </header>

        {/* 科普用途声明 */}
        <DisclaimerBar />

        <section>
          <h2 className="card-section-title">TerraHeritage</h2>
          <p className="text-sm leading-7 text-paper-dim">{t('aboutVision')}</p>
        </section>

        <section>
          <h2 className="card-section-title">{t('aboutScopeTitle')}</h2>
          <p className="text-sm leading-7 text-paper-dim">{t('aboutScopeBody')}</p>
        </section>

        <section>
          <h2 className="card-section-title">{t('aboutDataTitle')}</h2>
          <p className="text-sm leading-7 text-paper-dim">{t('aboutDataBody')}</p>
        </section>

        {/* 来源机构列表 */}
        <section>
          <h2 className="card-section-title">{t('aboutSourcesTitle')}</h2>
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} className="rounded-lg border border-[var(--panel-line)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{s.title}</p>
                  <TierBadge tier={s.tier} />
                </div>
                <p className="mt-1 text-xs text-paper-dim">{s.organization}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-xs text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {t('openOriginal')} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="card-section-title">{t('aboutOssTitle')}</h2>
          <p className="text-sm leading-7 text-paper-dim">{t('aboutOssBody')}</p>
        </section>

        <Link to="/" className="text-[var(--accent)] underline-offset-4 hover:underline">
          ← TerraHeritage
        </Link>
      </div>
    </div>
  );
}
