/**
 * 科普用途免责声明条 —— DESIGN.md §6。
 * 固定于 MedicineCard 顶部与 About 页;措辞为定稿,不可改写为医疗建议。
 */
import { useT } from '@/lib/i18n';

export default function DisclaimerBar() {
  const t = useT();
  return (
    <div
      role="note"
      className="rounded-md border border-[var(--warn)] bg-[rgba(208,128,80,0.10)] px-3 py-2 text-xs leading-5 text-[var(--warn)]"
    >
      {t('disclaimer')}
    </div>
  );
}
