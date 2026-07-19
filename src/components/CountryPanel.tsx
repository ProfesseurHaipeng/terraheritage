/**
 * 国家信息面板 —— DESIGN.md §6 CountryPanel。
 * 国名 / 首都 / 语言 / 概览 / 生态标签 / 区域列表(点击飞行到 region.center
 * 并显示区域简卡)/ 来源数 + ReviewBadge /"进入探索"按钮(flyTo 国家质心)。
 * 中文名来自 countryNames.ts 映射,无映射回落 GeoJSON 英文名。
 */
import { useState } from 'react';
import geoData from '@/data/geo/countries.geo.json';
import { countryNameZh } from '@/data/geo/countryNames';
import { countries, regionById } from '@/data';
import { countryCentroid } from '@/lib/geo';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { ReviewBadge } from './Badges';
import SourceDrawer from './SourceDrawer';

/** 按 ISO 数字码取展示名:中文映射优先,回落 GeoJSON 英文名 */
export function countryDisplayName(iso: string): string {
  const zh = countryNameZh(iso);
  if (zh) return zh;
  return geoData.features.find((f) => f.properties.id === iso)?.properties.name ?? iso;
}

export default function CountryPanel({ iso }: { iso: string }) {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const flyTo = useAppStore((s) => s.flyTo);
  const selectRegion = useAppStore((s) => s.selectRegion);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // 数据层可能没有该国的示例信息(尚未填充)
  const info = countries.find((c) => c.isoId === iso);
  const name = countryDisplayName(iso);
  const regionList = (info?.regionIds ?? [])
    .map((id) => regionById(id))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  function handleExplore() {
    const c = countryCentroid(iso);
    if (c) flyTo(c[0], c[1]);
  }

  function handleRegionClick(regionId: string) {
    const r = regionById(regionId);
    if (!r) return;
    flyTo(r.center[0], r.center[1]); // 飞行到区域中心
    selectRegion(regionId); // 显示区域简卡
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <header>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl leading-7">{name}</h2>
            {info && <ReviewBadge status={info.reviewStatus} />}
          </div>
          <p className="mt-1 font-mono text-xs text-paper-faint">ISO {iso}</p>
        </header>

        {!info ? (
          // 数据未覆盖的国家:按 §6 规范提示资料不足
          <p className="text-sm text-paper-dim">{t('insufficient')}</p>
        ) : (
          <>
            <dl className="space-y-2 text-sm">
              {info.capital && (
                <div>
                  <dt className="card-section-title">{t('capital')}</dt>
                  <dd className="text-paper-dim">{info.capital}</dd>
                </div>
              )}
              <div>
                <dt className="card-section-title">{t('languagesLabel')}</dt>
                <dd className="text-paper-dim">{info.languages.join('、')}</dd>
              </div>
            </dl>

            <section>
              <h3 className="card-section-title">{t('overview')}</h3>
              <p className="text-sm leading-6 text-paper-dim">{info.overview[locale]}</p>
            </section>

            <section>
              <h3 className="card-section-title">{t('ecosystems')}</h3>
              <div className="flex flex-wrap gap-1.5">
                {info.ecosystems.map((eco) => (
                  <span
                    key={eco}
                    className="rounded-full border border-[var(--eco)] px-2 py-0.5 text-[11px] text-[var(--eco)]"
                  >
                    {eco}
                  </span>
                ))}
              </div>
            </section>

            {regionList.length > 0 && (
              <section>
                <h3 className="card-section-title">{t('regionsLabel')}</h3>
                <ul className="space-y-1">
                  {regionList.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => handleRegionClick(r.id)}
                        className="w-full rounded-md border border-[var(--panel-line)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {r.names[locale]}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSourcesOpen(true)}
                className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {info.sourceIds.length} {t('sourcesCountSuffix')}
              </button>
              <button
                type="button"
                onClick={handleExplore}
                className="rounded-full border border-[var(--accent)] px-4 py-1.5 text-xs tracking-widest text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[#05080F]"
              >
                {t('enterCountry')}
              </button>
            </div>
          </>
        )}
      </div>

      {info && (
        <SourceDrawer sourceIds={info.sourceIds} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
      )}
    </div>
  );
}
