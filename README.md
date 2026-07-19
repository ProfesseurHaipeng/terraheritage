# TerraHeritage · 万物本草

**A 3D digital globe of plants, cultures and traditional medical knowledge — an open, non-profit educational prototype.**
万物本草·全球生命文化地球:一个探索"地点 → 生态 → 季节 → 植物 → 民族 → 传统医学 → 现代证据 → 安全"知识链的 3D 数字地球(开源公益原型)。

[中文说明 README.zh-CN.md](README.zh-CN.md)

![Intro](docs/screenshots/01-intro.png)

## ✨ What it is

TerraHeritage is not another encyclopedia. It is an interactive 3D Earth where
geography, ecology, seasons, plants, ethnic cultures and traditional medical
knowledge are connected as one explorable knowledge graph — with museum-grade
visuals and strict source/evidence labelling.

**MVP features**

- 🌍 Real spherical 3D globe (Three.js / React Three Fiber): starfield, atmosphere shader, ocean sun-glint, auto-rotation, drag/zoom with altitude-scaled damping
- 🗺️ 241 country shapes (Natural Earth, public domain) rendered as sphere-conforming fills — hover highlight, click to open country panel, double-click to fly in
- 🌱 Season engine: N/S-hemisphere logic, tropical wet/dry model, land re-tinting and high-latitude snow by month, year playback
- 🌿 Plant cards with a **dual-layer view**: cultural/historical records vs. modern evidence (A–E evidence badges), safety notes, sensitive-species coordinate fuzzing
- 🧑‍🤝‍🧑 Culture & medical-tradition layers with a fixed educational disclaimer
- 🐫 Historical spread routes (Silk Road, Tea Horse Road…) as animated great-circle arcs, labelled as schematic approximations
- 🔍 Global search (⌘K) across countries / plants / cultures / traditions, zh + en
- 🌐 Bilingual UI (中文 / English), responsive mobile bottom-sheet, keyboard shortcuts, reduced-motion mode, 3 quality tiers
- 🔎 Every fact carries source links + a `draft` review badge — no source, no publish

![Globe](docs/screenshots/02-globe.png)
![Country](docs/screenshots/04-country.png)
![Plant](docs/screenshots/06-plant.png)
![Mobile](docs/screenshots/08-mobile-medicine.png)

## 🚀 Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → dist/
npm run preview    # serve the production build
```

Requires Node.js 20+. Optional config: copy `.env.example` → `.env`.

**Keyboard**: `Space` toggle auto-rotation · `Esc` close panel · `R` global view · `F` focus selected country · `⌘K / Ctrl+K` search · `L` layers

## 🧱 Tech stack

Vite 7 · React 19 · TypeScript (strict) · Three.js + React Three Fiber + drei · zustand · Tailwind CSS · shadcn/ui · cmdk
No backend — all content ships as typed in-repo data modules (`src/data/`); geo data is vendored (`src/data/geo/`), so the site never depends on live external APIs.

```
src/
  three/       GlobeCanvas, Earth+Atmosphere shaders, CountryFills/Borders,
               SeasonLayer, RouteArcs, Markers, CameraRig, Stars
  components/  Panels, cards, search, season control, badges, drawers…
  data/        countries / regions / plants / cultures / medicine / routes / sources
  lib/         geo (spherical triangulation, picking), season, i18n, quality
  stores/      zustand app store
docs/          DESIGN.md (full design spec), screenshots
scripts/       convert-geo.mjs (Natural Earth → GeoJSON pipeline)
```

## ⚖️ Data, ethics & compliance

This is an **educational prototype**. All content records are **illustrative sample data marked `draft` (unreviewed)** — they demonstrate the information architecture, not verified facts.

- Every entity links to **real source institutions** (POWO/Kew, GBIF, WHO, UNESCO, IUCN, Flora of China, BHL, WFO, NIH NCCIH, Chinese Pharmacopoeia, EMA, PubMed); institution homepages are cited for transparency only.
- **No medical advice**: the platform offers cultural, historical and botanical education only. No dosages, no preparation steps, no efficacy claims, no purchase links.
- Traditional use ≠ modern clinical evidence; evidence levels A–E are shown per plant.
- Sensitive species (e.g. snow lotus, caterpillar fungus) have coordinates fuzzed to ecoregion level; wild harvesting is discouraged everywhere.
- Cultures are presented with modern-life context, non-exoticizing language, and no political judgement on borders.
- See [NOTICE.md](NOTICE.md) and [docs/DESIGN.md](docs/DESIGN.md) for the full governance model (source tiers S/A/B/C, review workflow, FAIR/CARE alignment).

## 🗺️ Roadmap

1. **MVP (this repo)** — globe core, 10+ countries, China SW & Tibet pilot, seasons, dual-layer cards, routes, search, i18n
2. Data engineering — source registry (40+ authorities), claim-level sourcing, review workflow, GBIF/POWO imports
3. Global expansion — more languages, knowledge graph, comparison mode, education mode, public API

## 🤝 Contributing

Contributions welcome — especially botany / anthropology / medical-safety reviewers.
Please keep the golden rule: **no fact without a source; no source below tier C; AI text is never a source.**

## 📄 License

Code: [MIT](LICENSE). Sample data & AI-generated illustration assets: see [NOTICE.md](NOTICE.md).
Geo data: Natural Earth (public domain).
