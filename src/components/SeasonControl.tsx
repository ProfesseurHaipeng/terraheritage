/**
 * 季节控制条 —— DESIGN.md §6 SeasonControl。
 * 底部居中:春(3月)/夏(6)/秋(9)/冬(12)快捷键 + 1–12 月滑块 +
 * 播放/暂停(store.playing,每 1.2s 月份 +1 循环)+ 当前月份名;
 * 若选中 Region,按其 seasonModel 显示该月季节 / 雨旱提示。
 */
import { useEffect } from 'react';
import { regionById } from '@/data';
import { MONTH_NAMES, useT, type DictKey } from '@/lib/i18n';
import { getSeasonState } from '@/lib/season';
import { useAppStore } from '@/stores/appStore';

const SEASON_SHORTCUTS: { key: DictKey; month: number }[] = [
  { key: 'spring', month: 3 },
  { key: 'summer', month: 6 },
  { key: 'autumn', month: 9 },
  { key: 'winter', month: 12 },
];

export default function SeasonControl() {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const month = useAppStore((s) => s.season.month);
  const playing = useAppStore((s) => s.playing);
  const regionId = useAppStore((s) => s.selectedRegionId);
  const setMonth = useAppStore((s) => s.setMonth);
  const setPlaying = useAppStore((s) => s.setPlaying);

  // 播放全年:每 1.2s 月份 +1 循环
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const m = useAppStore.getState().season.month;
      useAppStore.getState().setMonth((m % 12) + 1);
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing]);

  // 选中区域的季节提示(热带显示雨/旱)
  const region = regionId ? regionById(regionId) : undefined;
  const regionSeason = region ? t(getSeasonState(month, region.center[0]).season) : null;

  return (
    <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--panel-line)] bg-[var(--panel-bg)] px-4 py-2 backdrop-blur-md">
      {/* 四季快捷键 */}
      <div className="hidden items-center gap-1 sm:flex">
        {SEASON_SHORTCUTS.map(({ key, month: m }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMonth(m)}
            className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
              month === m ? 'bg-[rgba(201,161,95,0.2)] text-[var(--accent)]' : 'text-paper-dim hover:text-[var(--paper)]'
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {/* 月份滑块 */}
      <input
        type="range"
        min={1}
        max={12}
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        aria-label={t('narratorMonth')}
        className="h-1 w-28 cursor-pointer accent-[#C9A15F] sm:w-36"
      />

      {/* 当前月份名 + 区域季节提示 */}
      <span className="min-w-[3rem] text-center font-mono text-xs">
        {MONTH_NAMES[locale][month - 1]}
        {regionSeason && <span className="ml-1 text-[var(--eco)]">· {regionSeason}</span>}
      </span>

      {/* 播放 / 暂停 */}
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? t('pause') : t('playYear')}
        className="text-paper-dim transition-colors hover:text-[var(--accent)]"
      >
        {playing ? '⏸' : '▶'}
      </button>
    </div>
  );
}
