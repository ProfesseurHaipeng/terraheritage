/**
 * 全局状态(zustand)—— DESIGN.md §6。
 * 3D 场景与 DOM UI 共享;飞行请求用 nonce 递增触发 CameraRig 响应。
 */
import { create } from 'zustand';
import type { Locale } from '@/lib/i18n';
import { detectQuality, prefersReducedMotion, type Quality } from '@/lib/quality';

export interface LayerFlags {
  borders: boolean;
  plants: boolean;
  cultures: boolean;
  medicine: boolean;
  routes: boolean;
  labels: boolean;
}

export interface SeasonStateStore {
  mode: 'cycle' | 'month';
  month: number; // 1–12
}

/** 飞行目标(球面方向 + 目标半径由 CameraRig 决定) */
export interface FlightRequest {
  lat: number;
  lng: number;
  nonce: number; // 每次请求 +1,用于触发 effect
}

interface AppState {
  locale: Locale;
  quality: Quality;
  reducedMotion: boolean;

  // 拾取与选中
  hoveredIso: string | null;
  selectedCountryIso: string | null;
  selectedRegionId: string | null;
  selectedPlantId: string | null;
  selectedCultureId: string | null;
  selectedMedicineId: string | null;

  layers: LayerFlags;
  season: SeasonStateStore;
  introDone: boolean;
  panelOpen: boolean;
  searchOpen: boolean;
  playing: boolean; // 季节播放全年
  mobileSheet: boolean;
  autoRotate: boolean; // 空闲自转开关(空格键)
  flight: FlightRequest | null; // 当前飞行请求
  resetNonce: number; // 回全球视角信号
  layerPanelOpen: boolean; // 图层面板(L 键 / Header 按钮)
  settingsOpen: boolean; // 设置面板(Header 齿轮)

  setLocale: (l: Locale) => void;
  setQuality: (q: Quality) => void;
  setReducedMotion: (v: boolean) => void;
  setHoveredIso: (iso: string | null) => void;
  selectCountry: (iso: string | null) => void;
  selectRegion: (id: string | null) => void;
  selectPlant: (id: string | null) => void;
  selectCulture: (id: string | null) => void;
  selectMedicine: (id: string | null) => void;
  toggleLayer: (k: keyof LayerFlags) => void;
  setMonth: (m: number) => void;
  setSeasonMode: (mode: 'cycle' | 'month') => void;
  setIntroDone: () => void;
  setPanelOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setPlaying: (v: boolean) => void;
  setMobileSheet: (v: boolean) => void;
  toggleAutoRotate: () => void;
  toggleLayerPanel: () => void;
  setSettingsOpen: (v: boolean) => void;
  /** 请求镜头飞往指定经纬度 */
  flyTo: (lat: number, lng: number) => void;
  /** 回全球视角(z = 2.6) */
  resetView: () => void;
}

const now = new Date();

export const useAppStore = create<AppState>((set) => ({
  locale: (import.meta.env.VITE_DEFAULT_LOCALE as Locale) || 'zh',
  quality: detectQuality(),
  reducedMotion: prefersReducedMotion(),

  hoveredIso: null,
  selectedCountryIso: null,
  selectedRegionId: null,
  selectedPlantId: null,
  selectedCultureId: null,
  selectedMedicineId: null,

  layers: { borders: true, plants: true, cultures: true, medicine: true, routes: true, labels: true },
  season: { mode: 'month', month: now.getMonth() + 1 },
  introDone: false,
  panelOpen: false,
  searchOpen: false,
  playing: false,
  mobileSheet: false,
  autoRotate: true,
  flight: null,
  resetNonce: 0,
  layerPanelOpen: false,
  settingsOpen: false,

  setLocale: (locale) => set({ locale }),
  setQuality: (quality) => set({ quality }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setHoveredIso: (hoveredIso) => set({ hoveredIso }),
  selectCountry: (iso) =>
    set({ selectedCountryIso: iso, panelOpen: iso !== null }),
  selectRegion: (selectedRegionId) => set({ selectedRegionId, panelOpen: selectedRegionId !== null }),
  selectPlant: (selectedPlantId) => set({ selectedPlantId, panelOpen: selectedPlantId !== null }),
  selectCulture: (selectedCultureId) => set({ selectedCultureId, panelOpen: selectedCultureId !== null }),
  selectMedicine: (selectedMedicineId) =>
    set({ selectedMedicineId, panelOpen: selectedMedicineId !== null }),
  toggleLayer: (k) => set((s) => ({ layers: { ...s.layers, [k]: !s.layers[k] } })),
  setMonth: (m) => set((s) => ({ season: { ...s.season, month: m } })),
  setSeasonMode: (mode) => set((s) => ({ season: { ...s.season, mode } })),
  setIntroDone: () => set({ introDone: true }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setPlaying: (playing) => set({ playing }),
  setMobileSheet: (mobileSheet) => set({ mobileSheet }),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
  toggleLayerPanel: () => set((s) => ({ layerPanelOpen: !s.layerPanelOpen })),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  flyTo: (lat, lng) => set((s) => ({ flight: { lat, lng, nonce: (s.flight?.nonce ?? 0) + 1 } })),
  resetView: () => set((s) => ({ resetNonce: s.resetNonce + 1 })),
}));
