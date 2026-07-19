/**
 * 区域简卡 —— CountryPanel 区域列表点击后展示:
 * 名称 / 概览 / 季节模型对应的当前季节(或雨旱)提示;可返回所属国家。
 */
import { regionById } from '@/data';
import { countryDisplayName } from '@/components/CountryPanel';
import { MONTH_NAMES, useT } from '@/lib/i18n';
import { getSeasonState } from '@/lib/season';
import { useAppStore } from '@/stores/appStore';

export default function RegionCard({ regionId }: { regionId: string }) {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const month = useAppStore((s) => s.season.month);
  const selectCountry = useAppStore((s) => s.selectCountry);
  const region = regionById(regionId);

  if (!region) return <p className="p-5 text-sm text-paper-dim">{t('insufficient')}</p>;

  const { season } = getSeasonState(month, region.center[0]);
  const seasonText = t(season); // Season 与字典键同名:spring/summer/autumn/winter/rainy/dry

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-5">
      <header>
        <h2 className="font-display text-xl leading-7">{region.names[locale]}</h2>
        <p className="mt-1 font-mono text-xs text-paper-faint">
          {region.center[0].toFixed(1)}°, {region.center[1].toFixed(1)}°
        </p>
      </header>

      <section>
        <h3 className="card-section-title">{t('overview')}</h3>
        <p className="text-sm leading-6 text-paper-dim">{region.overview[locale]}</p>
      </section>

      <section className="rounded-lg border border-[var(--panel-line)] p-3">
        <h3 className="text-sm font-medium text-[var(--eco)]">{t('currentSeason')}</h3>
        <p className="mt-1.5 text-sm text-paper-dim">
          {MONTH_NAMES[locale][month - 1]} · {seasonText}
        </p>
      </section>

      <button
        type="button"
        onClick={() => selectCountry(region.countryIso)}
        className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← {t('backToCountry')}:{countryDisplayName(region.countryIso)}
      </button>
    </div>
  );
}
