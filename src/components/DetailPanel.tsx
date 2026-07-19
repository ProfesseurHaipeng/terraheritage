/**
 * 详情面板 —— DESIGN.md §6 DetailPanel。
 * 桌面右侧 380px 滑入(300ms ease-out,§3.3);role="dialog" + aria-label。
 * 按选中态优先级分发:植物 > 民族 > 医学 > 区域 > 国家。
 * DetailBody 同时供桌面面板与移动端 BottomSheet 复用(单抽屉原则)。
 */
import { cultureById, medicineById, plantById } from '@/data';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import PlantCard from './PlantCard';
import CultureCard from './CultureCard';
import MedicineCard from './MedicineCard';
import RegionCard from './RegionCard';
import CountryPanel from './CountryPanel';

type DetailKind = 'plant' | 'culture' | 'medicine' | 'region' | 'country';

/** 当前应展示的实体(按优先级) */
export function useActiveDetail(): { kind: DetailKind; id: string } | null {
  const plantId = useAppStore((s) => s.selectedPlantId);
  const cultureId = useAppStore((s) => s.selectedCultureId);
  const medicineId = useAppStore((s) => s.selectedMedicineId);
  const regionId = useAppStore((s) => s.selectedRegionId);
  const countryIso = useAppStore((s) => s.selectedCountryIso);
  if (plantId) return { kind: 'plant', id: plantId };
  if (cultureId) return { kind: 'culture', id: cultureId };
  if (medicineId) return { kind: 'medicine', id: medicineId };
  if (regionId) return { kind: 'region', id: regionId };
  if (countryIso) return { kind: 'country', id: countryIso };
  return null;
}

/** 关闭当前详情:清空全部选中态(单抽屉原则,面板始终只显示一个实体) */
export function closeDetail() {
  const s = useAppStore.getState();
  s.selectPlant(null);
  s.selectCulture(null);
  s.selectMedicine(null);
  s.selectRegion(null);
  s.selectCountry(null);
  s.setPanelOpen(false);
}

/** 面板内容(桌面 / 移动共用) */
export function DetailBody({ kind, id }: { kind: DetailKind; id: string }) {
  const t = useT();
  switch (kind) {
    case 'plant': {
      const plant = plantById(id);
      return plant ? <PlantCard plant={plant} /> : <Empty text={t('insufficient')} />;
    }
    case 'culture': {
      const culture = cultureById(id);
      return culture ? <CultureCard culture={culture} /> : <Empty text={t('insufficient')} />;
    }
    case 'medicine': {
      const item = medicineById(id);
      return item ? <MedicineCard item={item} /> : <Empty text={t('insufficient')} />;
    }
    case 'region':
      return <RegionCard regionId={id} />;
    case 'country':
      return <CountryPanel iso={id} />;
  }
}

function Empty({ text }: { text: string }) {
  return <p className="p-5 text-sm text-paper-dim">{text}</p>;
}

/** 桌面右侧面板本体 */
export default function DetailPanel() {
  const panelOpen = useAppStore((s) => s.panelOpen);
  const active = useActiveDetail();
  const t = useT();
  const open = panelOpen && active !== null;

  return (
    <aside
      role="dialog"
      aria-label={t('overview')}
      aria-hidden={!open}
      className={`fixed bottom-4 right-4 top-20 z-30 hidden w-[380px] flex-col overflow-hidden rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)] backdrop-blur-md transition-transform duration-300 ease-out md:flex ${
        open ? 'translate-x-0' : 'translate-x-[110%]'
      }`}
    >
      <button
        type="button"
        onClick={closeDetail}
        aria-label={t('close')}
        className="absolute right-3 top-3 z-20 text-paper-dim transition-colors hover:text-[var(--paper)]"
      >
        ✕
      </button>
      {active && <DetailBody kind={active.kind} id={active.id} />}
    </aside>
  );
}
