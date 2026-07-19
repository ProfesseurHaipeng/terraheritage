/**
 * 图层面板 —— DESIGN.md §6 LayerPanel。
 * 左侧悬浮开关(borders/plants/cultures/medicine/routes/labels)+ 图例(§3 图层色);
 * 默认收起,Header 按钮或按 L 展开;图层淡入淡出 200ms 由 3D 层挂载/卸载实现。
 */
import { useT } from '@/lib/i18n';
import { useAppStore, type LayerFlags } from '@/stores/appStore';

/** 图层键 → 图例色(§3.1 图层配色) */
const LAYER_DEFS: { key: keyof LayerFlags; labelKey: 'layerBorders' | 'layerPlants' | 'layerCultures' | 'layerMedicine' | 'layerRoutes' | 'layerLabels'; color: string }[] = [
  { key: 'borders', labelKey: 'layerBorders', color: 'var(--paper-dim)' },
  { key: 'plants', labelKey: 'layerPlants', color: 'var(--eco)' },
  { key: 'cultures', labelKey: 'layerCultures', color: 'var(--accent)' },
  { key: 'medicine', labelKey: 'layerMedicine', color: 'var(--medicine)' },
  { key: 'routes', labelKey: 'layerRoutes', color: 'var(--history)' },
  { key: 'labels', labelKey: 'layerLabels', color: 'var(--science)' },
];

export default function LayerPanel() {
  const open = useAppStore((s) => s.layerPanelOpen);
  const layers = useAppStore((s) => s.layers);
  const toggleLayer = useAppStore((s) => s.toggleLayer);
  const t = useT();

  return (
    <div
      className={`fixed left-4 top-20 z-30 rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)] backdrop-blur-md transition-all duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'
      }`}
    >
      <div className="border-b border-[var(--panel-line)] px-4 py-2.5 text-xs text-paper-faint">
        {t('layers')} · {t('legend')}
      </div>
      <ul className="space-y-1 px-2 py-2">
        {LAYER_DEFS.map(({ key, labelKey, color }) => {
          const on = layers[key];
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => toggleLayer(key)}
                aria-pressed={on}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[rgba(237,231,214,0.06)]"
              >
                {/* 图例色点 */}
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full transition-opacity"
                  style={{ background: color, opacity: on ? 1 : 0.25 }}
                />
                <span className={on ? '' : 'text-paper-faint'}>{t(labelKey)}</span>
                <span className="ml-auto font-mono text-[10px] text-paper-faint">{on ? 'ON' : 'OFF'}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
