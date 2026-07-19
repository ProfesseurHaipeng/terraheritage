# TerraHeritage 地球项目

An immersive 3D heritage visualization experience built with React, TypeScript, and Vite. TerraHeritage renders a cinematic Earth that highlights cultural and natural landmarks across the globe, blending atmospheric lighting, high-resolution textures, and smooth orbital transitions. The UI is presented in Chinese with the goal of making exploration intuitive through clicks, zooms, and inertial rotation.

## Language versions

[中文说明 README.md](README.md)

## Overview

- Real-time 3D Earth rendering with physically inspired motion and seasonal color grading.
- Curated heritage site data enriched with metadata and photographic compositions.
- Cinematic camera choreography powered by a lightweight state machine.
- Optimized asset pipeline with high-fidelity textures for static hosting.
- Responsive UI overlays providing site information and navigation hints.

## Quick start

### Requirements

- Node.js 18+
- npm 9+

### Run locally

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000` by default.

### Binary assets restore

The 17 image binaries (5 PNGs under `docs/screenshots/`, 9 JPG/PNGs under `public/assets/`, and 3 PNGs under `public/textures/`) are stored as base64 text under `assets-b64/`. After cloning, run:

```bash
bash scripts/restore-assets.sh
```

The script decodes everything in one pass and verifies that the restored files are non-empty; afterwards `npm install && npm run dev` works as usual.

## Build and preview

```bash
npm run build
npm run preview
```

## Project structure

```
.
├── public/                # Static assets (textures, preview images, favicons)
├── src/
│   ├── components/        # UI and 3D scene components
│   ├── data/              # Heritage and geographic datasets
│   ├── shaders/           # GLSL shader programs
│   ├── state/             # Camera and scene state machine
│   ├── utils/             # Math and color utilities
│   └── workers/           # Web Worker pipelines
└── docs/                  # Project showcase and design docs
```

## Screenshots

The project ships five UI screenshots showcasing the complete experience, located in `docs/screenshots/`.

| No. | Scene | Preview |
| --- | --- | --- |
| 01 | Full Earth overview from space | ![Full Earth overview from space](docs/screenshots/01-overview.png) |
| 02 | Satellite basemap with global heritage distribution | ![Satellite basemap with global heritage distribution](docs/screenshots/02-globe-satellite.png) |
| 03 | Heritage site information panel | ![Heritage site information panel](docs/screenshots/03-info-panel.png) |
| 04 | Photographic close-up: Pyramids of Giza | ![Photographic close-up: Pyramids of Giza](docs/screenshots/04-closeup.png) |
| 05 | Terrain mode seasonal colors: Great Wall of China | ![Terrain mode seasonal colors: Great Wall of China](docs/screenshots/05-terrain-seasons.png) |

## Core scripts

- `npm run dev`: Start the Vite development server
- `npm run build`: Produce the production build
- `npm run preview`: Preview the production build locally

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
