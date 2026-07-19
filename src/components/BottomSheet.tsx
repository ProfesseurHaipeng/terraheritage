/**
 * 移动端底部抽屉 —— DESIGN.md §6 BottomSheet。
 * 收起(露 3rem 把手)/ 半开(45vh)/ 全开(85vh)三态,触摸拖拽把手切换;
 * 同一时间只开一个(内容由 DetailBody 统一分发);桌面端(md+)隐藏。不加依赖。
 */
import { useRef, useState, type TouchEvent } from 'react';
import { DetailBody, closeDetail, useActiveDetail } from './DetailPanel';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';

type SheetState = 'collapsed' | 'half' | 'full';

const HEIGHT: Record<SheetState, string> = {
  collapsed: '3rem',
  half: '45vh',
  full: '85vh',
};
const ORDER: SheetState[] = ['collapsed', 'half', 'full'];

export default function BottomSheet() {
  const active = useActiveDetail();
  const panelOpen = useAppStore((s) => s.panelOpen);
  const t = useT();
  const [state, setState] = useState<SheetState>('half');
  const dragStartY = useRef<number | null>(null);

  const open = panelOpen && active !== null;

  function onTouchStart(e: TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    if (dragStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    dragStartY.current = null;
    const idx = ORDER.indexOf(state);
    if (dy < -40 && idx < ORDER.length - 1) setState(ORDER[idx + 1]); // 上滑展开
    else if (dy > 40 && idx > 0) setState(ORDER[idx - 1]); // 下滑收起
  }

  if (!open || !active) return null;

  return (
    <div
      role="dialog"
      aria-label={t('overview')}
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-hidden rounded-t-2xl border-t border-[var(--panel-line)] bg-[var(--panel-bg)] backdrop-blur-md transition-[height] duration-300 ease-out md:hidden"
      style={{ height: HEIGHT[state] }}
    >
      {/* 拖拽把手 */}
      <div
        className="flex h-12 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-1.5"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => setState(state === 'full' ? 'half' : 'full')}
      >
        <span className="h-1 w-10 rounded-full bg-[rgba(237,231,214,0.3)]" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeDetail();
          }}
          aria-label={t('close')}
          className="absolute right-4 top-3 text-paper-dim"
        >
          ✕
        </button>
      </div>
      {/* 内容区(收起态仍可瞥见标题区) */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <DetailBody kind={active.kind} id={active.id} />
      </div>
    </div>
  );
}
