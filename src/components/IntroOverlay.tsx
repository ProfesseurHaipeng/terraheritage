/**
 * 首页引导层 —— DESIGN.md §3.3 / §6。
 * 标语宽度裁切揭示 6s(纯 CSS,减少动态时直接显示)、副标题;
 * 四入口按钮全部生效:
 *  1. 开始探索(仅关闭 intro)
 *  2. 随机前往一个地区(随机 region,飞行 + 选中)
 *  3. 查看此刻正在开花的植物(floweringMonths 含当前月的第一种,飞行 + 选中)
 *  4. 进入今日文化故事(第一条 culture,飞行 + 选中)
 * 底部统计行使用 data 的 stats;点击背景任意处跳过。
 */
import { cultures, plants, regions, stats } from '@/data';
import { useT } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';

export default function IntroOverlay() {
  const introDone = useAppStore((s) => s.introDone);
  const t = useT();

  if (introDone) return null;

  const s = useAppStore.getState;

  /** 开始探索:仅关闭 */
  function handleEnter() {
    s().setIntroDone();
  }

  /** 随机前往一个地区 */
  function handleRandom() {
    const r = regions[Math.floor(Math.random() * regions.length)];
    if (r) {
      s().flyTo(r.center[0], r.center[1]);
      s().selectRegion(r.id);
    }
    s().setIntroDone();
  }

  /** 此刻正在开花的植物(第一种) */
  function handleFlowering() {
    const month = new Date().getMonth() + 1;
    const p = plants.find((pl) => pl.floweringMonths.includes(month)) ?? plants[0];
    if (p && p.distribution.length > 0) {
      s().flyTo(p.distribution[0][0], p.distribution[0][1]);
      s().selectPlant(p.id);
    }
    s().setIntroDone();
  }

  /** 今日文化故事(第一条 culture) */
  function handleStory() {
    const c = cultures[0];
    if (c && c.areas.length > 0) {
      s().flyTo(c.areas[0][0], c.areas[0][1]);
      s().selectCulture(c.id);
    }
    s().setIntroDone();
  }

  const entries = [
    { label: t('statsCountries'), value: stats.countries },
    { label: t('statsPlants'), value: stats.plants },
    { label: t('statsCultures'), value: stats.cultures },
    { label: t('statsMedicines'), value: stats.medicine },
    { label: t('statsSources'), value: stats.sources },
  ];

  const buttons = [
    { label: t('enterExplore'), onClick: handleEnter, primary: true },
    { label: t('enterRandom'), onClick: handleRandom, primary: false },
    { label: t('enterFlowering'), onClick: handleFlowering, primary: false },
    { label: t('enterStory'), onClick: handleStory, primary: false },
  ];

  return (
    // 点击背景任意处跳过 intro
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
      onClick={handleEnter}
    >
      <div
        className="flex max-w-3xl flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标语:宽度裁切揭示 6s */}
        <h1 className="font-display text-2xl leading-relaxed md:text-4xl">
          <span className="slogan-reveal">{t('slogan')}</span>
        </h1>
        <p className="mt-4 text-sm text-paper-dim md:text-base">{t('subtitle')}</p>

        {/* 四入口按钮:主按钮立即可见可点(与 6s 动画并行),次按钮淡入 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {buttons.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              className={
                b.primary
                  ? 'rounded-full border border-[var(--accent)] bg-[var(--accent)] px-7 py-2.5 text-sm tracking-widest text-[#05080F] transition-opacity hover:opacity-85'
                  : 'intro-fade rounded-full border border-[var(--panel-line)] px-5 py-2.5 text-xs text-paper-dim transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 底部统计行(真实数据,随动画淡入) */}
      <div
        className="intro-fade absolute bottom-10 flex gap-6 text-center sm:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {entries.map((it) => (
          <div key={it.label}>
            <div className="font-mono text-lg text-[var(--paper)]">{it.value}</div>
            <div className="mt-1 text-xs text-paper-faint">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
