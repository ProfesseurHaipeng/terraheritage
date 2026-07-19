/**
 * 首页:全屏 3D 地球 + Header + IntroOverlay + 详情面板(桌面 DetailPanel /
 * 移动 BottomSheet)+ SearchPalette + LayerPanel + SeasonControl + SettingsPanel
 * + StatusNarrator。
 * 键盘:空格=自转开关 / Esc=关面板与搜索 / R=回全球 / F=聚焦选中国 / L=图层面板。
 * 图层开关驱动 RouteArcs / Markers 可见性;medicine 标记用 §15 锚点。
 */
import { useEffect, useMemo, useState } from 'react';
import GlobeCanvas from '@/three/GlobeCanvas';
import type { MarkerSpec } from '@/three/Markers';
import Header from '@/components/Header';
import IntroOverlay from '@/components/IntroOverlay';
import DetailPanel, { closeDetail } from '@/components/DetailPanel';
import BottomSheet from '@/components/BottomSheet';
import SearchPalette from '@/components/SearchPalette';
import LayerPanel from '@/components/LayerPanel';
import SeasonControl from '@/components/SeasonControl';
import SettingsPanel from '@/components/SettingsPanel';
import StatusNarrator from '@/components/StatusNarrator';
import { countryDisplayName } from '@/components/CountryPanel';
import { cultures, medicine, plants, routes } from '@/data';
import { MEDICINE_ANCHORS } from '@/lib/anchors';
import { countryCentroid } from '@/lib/geo';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/stores/appStore';

/** SVG feTurbulence 噪点(DESIGN.md §3.3:overlay / 0.06) */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** 悬停国名标签(跟随光标,layers.labels 开启时显示) */
function HoverTag() {
  const hoveredIso = useAppStore((s) => s.hoveredIso);
  const labelsOn = useAppStore((s) => s.layers.labels);
  const [pos, setPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      setPos([e.clientX, e.clientY]);
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (!hoveredIso || !labelsOn) return null;
  return (
    <div
      className="pointer-events-none fixed z-40 rounded-md border border-[var(--panel-line)] bg-[var(--panel-bg)] px-2.5 py-1 text-xs backdrop-blur-md"
      style={{ left: pos[0] + 14, top: pos[1] + 10 }}
    >
      {countryDisplayName(hoveredIso)}
    </div>
  );
}

export default function Home() {
  const layers = useAppStore((s) => s.layers);
  const isMobile = useIsMobile();

  // 标记点:植物 / 文化 / 医学(§15 锚点),受图层开关过滤
  const markers = useMemo<MarkerSpec[]>(() => {
    const out: MarkerSpec[] = [];
    if (layers.plants) {
      for (const p of plants) {
        for (const pos of p.distribution) out.push({ id: p.id, kind: 'plant', position: pos });
      }
    }
    if (layers.cultures) {
      for (const c of cultures) {
        for (const pos of c.areas) out.push({ id: c.id, kind: 'culture', position: pos });
      }
    }
    if (layers.medicine) {
      for (const m of medicine) {
        const anchor = MEDICINE_ANCHORS[m.id];
        if (anchor) out.push({ id: m.id, kind: 'medicine', position: anchor });
      }
    }
    return out;
  }, [layers.plants, layers.cultures, layers.medicine]);

  /** 标记点击:按 id 归属写入对应选中态 */
  function handleMarkerSelect(id: string) {
    const s = useAppStore.getState();
    if (plants.some((p) => p.id === id)) s.selectPlant(id);
    else if (cultures.some((c) => c.id === id)) s.selectCulture(id);
    else if (medicine.some((m) => m.id === id)) s.selectMedicine(id);
  }

  // 键盘快捷键
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return; // 输入框内不劫持
      const s = useAppStore.getState();
      if (e.code === 'Space') {
        e.preventDefault();
        s.toggleAutoRotate();
      } else if (e.key === 'Escape') {
        if (s.searchOpen) s.setSearchOpen(false);
        else if (s.settingsOpen) s.setSettingsOpen(false);
        else closeDetail();
      } else if (e.key === 'r' || e.key === 'R') {
        s.resetView();
      } else if (e.key === 'f' || e.key === 'F') {
        if (s.selectedCountryIso) {
          const c = countryCentroid(s.selectedCountryIso);
          if (c) s.flyTo(c[0], c[1]);
        }
      } else if (e.key === 'l' || e.key === 'L') {
        s.toggleLayerPanel();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 全屏 3D 地球(边界图层开关控制边界线显隐) */}
      <div className="absolute inset-0">
        <GlobeCanvas
          routes={routes}
          routesVisible={layers.routes}
          markers={markers}
          onMarkerSelect={handleMarkerSelect}
        />
      </div>

      {/* 噪点材质层 */}
      <div className="grain-overlay" style={{ backgroundImage: GRAIN_SVG }} />

      <Header />
      <IntroOverlay />
      <HoverTag />
      <LayerPanel />
      <SeasonControl />
      <SettingsPanel />
      <SearchPalette />
      <StatusNarrator />

      {/* 详情:桌面右侧面板,移动端底部抽屉(单抽屉原则) */}
      {isMobile ? <BottomSheet /> : <DetailPanel />}
    </div>
  );
}
