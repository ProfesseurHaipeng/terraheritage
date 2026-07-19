/**
 * 设置面板 —— DESIGN.md §6 SettingsPanel。
 * 画质三档(高/平衡/节能)、减少动态开关、语言切换;Header 齿轮触发。
 */
import { useT } from '@/lib/i18n';
import type { Quality } from '@/lib/quality';
import { useAppStore } from '@/stores/appStore';

const QUALITY_OPTIONS: { value: Quality; key: 'qualityHigh' | 'qualityBalanced' | 'qualitySaver' }[] = [
  { value: 'high', key: 'qualityHigh' },
  { value: 'balanced', key: 'qualityBalanced' },
  { value: 'saver', key: 'qualitySaver' },
];

export default function SettingsPanel() {
  const open = useAppStore((s) => s.settingsOpen);
  const setOpen = useAppStore((s) => s.setSettingsOpen);
  const quality = useAppStore((s) => s.quality);
  const setQuality = useAppStore((s) => s.setQuality);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const t = useT();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-label={t('settings')}
        className="absolute right-4 top-16 w-64 rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)] p-4 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-medium">{t('settings')}</h3>

        {/* 画质三档 */}
        <p className="card-section-title mt-4">{t('qualityLabel')}</p>
        <div className="flex gap-1">
          {QUALITY_OPTIONS.map(({ value, key }) => (
            <button
              key={value}
              type="button"
              onClick={() => setQuality(value)}
              aria-pressed={quality === value}
              className={`flex-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                quality === value
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--panel-line)] text-paper-dim hover:text-[var(--paper)]'
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {/* 减少动态开关 */}
        <label className="mt-4 flex cursor-pointer items-center justify-between text-sm">
          <span>{t('reducedMotion')}</span>
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              reducedMotion ? 'bg-[var(--accent)]' : 'bg-[rgba(237,231,214,0.2)]'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#05080F] transition-transform ${
                reducedMotion ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>

        {/* 语言切换 */}
        <label className="mt-4 flex items-center justify-between text-sm">
          <span>{t('language')}</span>
          <button
            type="button"
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="rounded-md border border-[var(--panel-line)] px-2.5 py-1 text-xs text-paper-dim transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {locale === 'zh' ? '中文' : 'English'}
          </button>
        </label>
      </div>
    </div>
  );
}
