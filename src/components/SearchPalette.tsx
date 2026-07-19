/**
 * 全局搜索弹层(cmdk 风格)—— DESIGN.md §6 SearchPalette。
 * 对 countries / plants / cultures / medicine 的中英文字段即时过滤,
 * 分组 + 类型徽章 + ReviewBadge;选中后写 store、飞行到对应锚点、关闭。
 * 入口:Header 按钮 + Ctrl/Cmd+K。
 */
import { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import { countries, cultures, medicine, plants } from '@/data';
import { MEDICINE_ANCHORS } from '@/lib/anchors';
import { countryCentroid } from '@/lib/geo';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';
import { countryDisplayName } from './CountryPanel';
import { ReviewBadge } from './Badges';

type HitKind = 'country' | 'plant' | 'culture' | 'medicine';

interface Hit {
  kind: HitKind;
  id: string;
  /** 主标题(随界面语言) */
  title: string;
  /** 用于匹配的文本(中英混合) */
  matchText: string;
  reviewStatus: 'draft' | 'partial' | 'reviewed';
}

/** 组装全部可搜索条目(语言切换时重建标题) */
function useHits(): Hit[] {
  const locale = useAppStore((s) => s.locale);
  return useMemo(() => {
    const hits: Hit[] = [];
    for (const c of countries) {
      hits.push({
        kind: 'country',
        id: c.isoId,
        title: c.names[locale] || countryDisplayName(c.isoId),
        matchText: `${c.names.zh} ${c.names.en} ${countryDisplayName(c.isoId)}`,
        reviewStatus: c.reviewStatus,
      });
    }
    for (const p of plants) {
      hits.push({
        kind: 'plant',
        id: p.id,
        title: p.names[locale],
        matchText: `${p.names.zh} ${p.names.en} ${p.names.latin} ${p.names.local ?? ''}`,
        reviewStatus: p.reviewStatus,
      });
    }
    for (const c of cultures) {
      hits.push({
        kind: 'culture',
        id: c.id,
        title: c.names[locale],
        matchText: `${c.names.zh} ${c.names.en} ${c.selfName ?? ''}`,
        reviewStatus: c.reviewStatus,
      });
    }
    for (const m of medicine) {
      hits.push({
        kind: 'medicine',
        id: m.id,
        title: m.names[locale],
        matchText: `${m.names.zh} ${m.names.en}`,
        reviewStatus: m.reviewStatus,
      });
    }
    return hits;
  }, [locale]);
}

const KIND_BADGE_COLOR: Record<HitKind, string> = {
  country: 'var(--paper-dim)',
  plant: 'var(--eco)',
  culture: 'var(--accent)',
  medicine: 'var(--medicine)',
};

export default function SearchPalette() {
  const open = useAppStore((s) => s.searchOpen);
  const setOpen = useAppStore((s) => s.setSearchOpen);
  const t = useT();
  const hits = useHits();
  const [query, setQuery] = useState('');

  // Cmd/Ctrl+K 开关(全局)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useAppStore.getState().setSearchOpen(!useAppStore.getState().searchOpen);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // 关闭时清空查询
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = q ? hits.filter((h) => h.matchText.toLowerCase().includes(q)) : hits;

  /** 选中:写 store + 飞行 + 关闭 */
  function handleSelect(hit: Hit) {
    const s = useAppStore.getState();
    let target: [number, number] | null = null;
    if (hit.kind === 'country') {
      s.selectCountry(hit.id);
      target = countryCentroid(hit.id);
    } else if (hit.kind === 'plant') {
      s.selectPlant(hit.id);
      target = plants.find((p) => p.id === hit.id)?.distribution[0] ?? null;
    } else if (hit.kind === 'culture') {
      s.selectCulture(hit.id);
      target = cultures.find((c) => c.id === hit.id)?.areas[0] ?? null;
    } else {
      s.selectMedicine(hit.id);
      target = MEDICINE_ANCHORS[hit.id] ?? null;
    }
    if (target) s.flyTo(target[0], target[1]);
    setOpen(false);
  }

  const groups: { kind: HitKind; label: string }[] = [
    { kind: 'country', label: t('groupCountries') },
    { kind: 'plant', label: t('groupPlants') },
    { kind: 'culture', label: t('groupCultures') },
    { kind: 'medicine', label: t('groupMedicine') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(5,8,15,0.6)] pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-label={t('search')}
        className="w-[min(92vw,34rem)] overflow-hidden rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)] backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} label={t('search')}>
          <div className="border-b border-[var(--panel-line)] px-4">
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-paper-faint"
            />
          </div>
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-paper-dim">{t('searchNoResults')}</p>
            )}
            {groups.map(({ kind, label }) => {
              const items = filtered.filter((h) => h.kind === kind);
              if (items.length === 0) return null;
              return (
                <Command.Group
                  key={kind}
                  heading={label}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-paper-faint"
                >
                  {items.map((h) => (
                    <Command.Item
                      key={`${h.kind}:${h.id}`}
                      value={`${h.kind}:${h.id}`}
                      onSelect={() => handleSelect(h)}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm data-[selected=true]:bg-[rgba(201,161,95,0.12)]"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: KIND_BADGE_COLOR[h.kind] }}
                        />
                        {h.title}
                      </span>
                      <ReviewBadge status={h.reviewStatus} />
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
