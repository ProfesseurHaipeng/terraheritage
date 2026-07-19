/**
 * 顶部栏 —— DESIGN.md §6 Header(极简版)。
 * logo + 标题、搜索(带 ⌘K 提示)、图层、语言(中/EN)、设置、关于(/about);
 * 毛玻璃样式用 §3 --panel-bg。
 */
import { Link } from 'react-router';
import { Info, Layers, Search, Settings } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';

const ICON_BTN =
  'flex h-8 w-8 items-center justify-center rounded-md text-paper-dim transition-colors hover:bg-[rgba(237,231,214,0.08)] hover:text-[var(--paper)]';

export default function Header() {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const toggleLayerPanel = useAppStore((s) => s.toggleLayerPanel);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  return (
    <header className="absolute left-0 right-0 top-0 z-30 flex h-16 items-center gap-2 px-4">
      <img src="/assets/logo.png" alt="TerraHeritage" className="h-8 w-8 rounded-full" />
      <span className="font-display text-lg tracking-wide">TerraHeritage</span>
      <span className="hidden text-xs text-paper-faint sm:inline">万物本草</span>

      <div className="ml-auto flex items-center gap-1 rounded-full border border-[var(--panel-line)] bg-[var(--panel-bg)] px-2 py-1 backdrop-blur-md">
        {/* 搜索(带 ⌘K 提示) */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label={t('search')}
          className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-paper-dim transition-colors hover:text-[var(--paper)]"
        >
          <Search size={15} />
          <span className="hidden sm:inline">{t('search')}</span>
          <kbd className="hidden rounded border border-[var(--panel-line)] px-1 font-mono text-[10px] text-paper-faint sm:inline">
            ⌘K
          </kbd>
        </button>
        {/* 图层 */}
        <button type="button" onClick={toggleLayerPanel} aria-label={t('layers')} className={ICON_BTN}>
          <Layers size={16} />
        </button>
        {/* 语言切换 */}
        <button
          type="button"
          onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          aria-label={t('language')}
          className={`${ICON_BTN} w-auto px-2 font-mono text-xs`}
        >
          {t('switchLang')}
        </button>
        {/* 设置 */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label={t('settings')}
          className={ICON_BTN}
        >
          <Settings size={16} />
        </button>
        {/* 关于 */}
        <Link to="/about" aria-label={t('about')} className={ICON_BTN}>
          <Info size={16} />
        </Link>
      </div>
    </header>
  );
}
