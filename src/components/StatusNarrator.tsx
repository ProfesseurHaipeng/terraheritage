/**
 * 无障碍状态播报 —— DESIGN.md §6 StatusNarrator。
 * visually-hidden + aria-live="polite";播报选中实体名、图层开关、月份变化。
 */
import { useEffect, useRef, useState } from 'react';
import { cultures, medicine, plants, regionById } from '@/data';
import { MONTH_NAMES, useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { countryDisplayName } from './CountryPanel';

export default function StatusNarrator() {
  const t = useT();
  const locale = useAppStore((s) => s.locale);
  const [message, setMessage] = useState('');
  const lastLayerSig = useRef('');

  // 选中实体播报
  const plantId = useAppStore((s) => s.selectedPlantId);
  const cultureId = useAppStore((s) => s.selectedCultureId);
  const medicineId = useAppStore((s) => s.selectedMedicineId);
  const regionId = useAppStore((s) => s.selectedRegionId);
  const countryIso = useAppStore((s) => s.selectedCountryIso);

  useEffect(() => {
    let name: string | null = null;
    if (plantId) name = plants.find((p) => p.id === plantId)?.names[locale] ?? null;
    else if (cultureId) name = cultures.find((c) => c.id === cultureId)?.names[locale] ?? null;
    else if (medicineId) name = medicine.find((m) => m.id === medicineId)?.names[locale] ?? null;
    else if (regionId) name = regionById(regionId)?.names[locale] ?? null;
    else if (countryIso) name = countryDisplayName(countryIso);
    if (name) setMessage(`${t('narratorSelected')}:${name}`);
  }, [plantId, cultureId, medicineId, regionId, countryIso, locale, t]);

  // 图层开关播报
  const layers = useAppStore((s) => s.layers);
  useEffect(() => {
    const sig = JSON.stringify(layers);
    if (lastLayerSig.current && lastLayerSig.current !== sig) {
      for (const k of Object.keys(layers) as (keyof typeof layers)[]) {
        const prev = JSON.parse(lastLayerSig.current) as typeof layers;
        if (prev[k] !== layers[k]) {
          setMessage(`${k} ${layers[k] ? t('narratorLayerOn') : t('narratorLayerOff')}`);
          break;
        }
      }
    }
    lastLayerSig.current = sig;
  }, [layers, t]);

  // 月份变化播报
  const month = useAppStore((s) => s.season.month);
  useEffect(() => {
    setMessage(`${t('narratorMonth')}:${MONTH_NAMES[locale][month - 1]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  return (
    <div aria-live="polite" role="status" className="visually-hidden">
      {message}
    </div>
  );
}
