/**
 * 来源抽屉 —— DESIGN.md §6 SourceDrawer。
 * 输入 sourceIds,渲染来源清单:标题 / 机构 / 等级徽章 / 许可说明 / 访问日期 /
 * 原始链接(target=_blank rel=noreferrer)。从右侧滑入,覆盖在详情面板之上。
 */
import { sourceById } from '@/data';
import { useT } from '@/lib/i18n';
import { TierBadge } from './Badges';

interface SourceDrawerProps {
  sourceIds: string[];
  open: boolean;
  onClose: () => void;
}

export default function SourceDrawer({ sourceIds, open, onClose }: SourceDrawerProps) {
  const t = useT();
  const list = sourceIds
    .map((id) => sourceById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <div
      role="dialog"
      aria-label={t('sourceTitle')}
      aria-hidden={!open}
      className={`absolute inset-0 z-10 flex flex-col bg-[var(--panel-bg)] backdrop-blur-md transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--panel-line)] px-5 py-4">
        <h3 className="font-display text-base">{t('sourceTitle')}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="text-paper-dim transition-colors hover:text-[var(--paper)]"
        >
          ✕
        </button>
      </div>
      <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {list.map((s) => (
          <li key={s.id} className="rounded-lg border border-[var(--panel-line)] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-5">{s.title}</p>
              <TierBadge tier={s.tier} />
            </div>
            <p className="mt-1 text-xs text-paper-dim">{s.organization}</p>
            {s.licenseNote && (
              <p className="mt-1 text-xs text-paper-faint">
                {t('sourceLicense')}:{s.licenseNote}
              </p>
            )}
            <p className="mt-1 text-xs text-paper-faint">
              {t('sourceAccessed')}:{s.accessedAt}
            </p>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {t('openOriginal')} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
