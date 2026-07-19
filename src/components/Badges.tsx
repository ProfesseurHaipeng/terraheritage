/**
 * 复用徽章 —— DESIGN.md §6 Badges。
 * ReviewBadge:draft 显示"示例数据 · 待审核"(另有 partial / reviewed 两态);
 * EvidenceBadge:A–E 按 §3 语义色;SensitiveBadge:grid10/grid50 显示"位置已模糊";
 * RiskBadge:warn / risk 两档(警告橙 / 克制红)。
 */
import type { EvidenceLevel, ReviewStatus, SensitivityLevel } from '@/types';
import { useT } from '@/lib/i18n';

const BASE = 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4';

/** 审核状态徽章:MVP 数据一律 draft */
export function ReviewBadge({ status }: { status: ReviewStatus }) {
  const t = useT();
  const map = {
    draft: { text: t('reviewDraft'), color: 'var(--warn)', bg: 'rgba(208,128,80,0.12)' },
    partial: { text: t('reviewPartial'), color: 'var(--science)', bg: 'rgba(124,156,196,0.12)' },
    reviewed: { text: t('reviewReviewed'), color: 'var(--protect)', bg: 'rgba(95,168,160,0.12)' },
  } as const;
  const m = map[status];
  return (
    <span className={BASE} style={{ color: m.color, borderColor: m.color, background: m.bg }}>
      {m.text}
    </span>
  );
}

/** 证据等级徽章:A 绿 → E 红(§3 语义色) */
export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const t = useT();
  const map: Record<EvidenceLevel, { key: 'evidenceA' | 'evidenceB' | 'evidenceC' | 'evidenceD' | 'evidenceE'; color: string }> = {
    A: { key: 'evidenceA', color: 'var(--protect)' },
    B: { key: 'evidenceB', color: 'var(--science)' },
    C: { key: 'evidenceC', color: 'var(--accent)' },
    D: { key: 'evidenceD', color: 'var(--warn)' },
    E: { key: 'evidenceE', color: 'var(--risk)' },
  };
  const m = map[level];
  return (
    <span className={BASE} style={{ color: m.color, borderColor: m.color }} title={t('evidenceLevel')}>
      {t(m.key)}
    </span>
  );
}

/** 地理敏感徽章:坐标只到生态区时展示 */
export function SensitiveBadge({ level }: { level: SensitivityLevel }) {
  const t = useT();
  if (level === 'public' || level === 'adminOnly') return null;
  return (
    <span className={BASE} style={{ color: 'var(--protect)', borderColor: 'var(--protect)' }}>
      {t('sensitiveBlurred')} · {level}
    </span>
  );
}

/** 风险徽章:warn 警告橙 / risk 克制红 */
export function RiskBadge({ level }: { level: 'warn' | 'risk' }) {
  const t = useT();
  const color = level === 'risk' ? 'var(--risk)' : 'var(--warn)';
  return (
    <span className={BASE} style={{ color, borderColor: color }}>
      {level === 'risk' ? t('riskHigh') : t('riskWarn')}
    </span>
  );
}

/** 来源等级徽章:S 金 / A 蓝 / B 绿 / C 灰 */
export function TierBadge({ tier }: { tier: 'S' | 'A' | 'B' | 'C' }) {
  const color =
    tier === 'S' ? 'var(--accent)' : tier === 'A' ? 'var(--science)' : tier === 'B' ? 'var(--eco)' : 'var(--paper-dim)';
  return (
    <span className={BASE} style={{ color, borderColor: color }}>
      {tier}
    </span>
  );
}
