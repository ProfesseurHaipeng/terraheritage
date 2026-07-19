# TerraHeritage 地球项目

一个以 React、TypeScript 与 Vite 构建的沉浸式 3D 世界遗产可视化体验。项目以交互式地球呈现人类文明瑰宝，融合电影化运镜、氛围光照、高分辨率纹理与平滑轨道过渡。界面以中文呈现，可通过点击、缩放与惯性旋转探索全球遗产地。

## 语言版本

[English README](README.en.md)

## 概览

- 实时渲染的 3D 地球，配合物理感知的运动与季节性色彩调色。
- 精选世界遗产数据，丰富的元信息与摄影构图。
- 由 lightweight 状态机驱动的电影化相机器乐。
- 为静态托管优化的资源管线与高保真纹理。
- 响应式 UI 叠加层，提供遗产地信息与导航提示。

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 本地运行

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`。

### 二进制资产还原

仓库中的 17 个图片类二进制资产（`docs/screenshots/` 下 5 张 PNG、`public/assets/` 下 9 张 JPG/PNG、`public/textures/` 下 3 张 PNG）以 base64 文本形式存放于 `assets-b64/` 目录。克隆仓库后请运行：

```bash
bash scripts/restore-assets.sh
```

脚本会一次性完成解码还原并校验文件非空，之后即可正常 `npm install && npm run dev`。

## 构建与预览

```bash
npm run build
npm run preview
```

## 项目结构

```
.
├── public/                # 静态资源（纹理、预览图、站点图标）
├── src/
│   ├── components/        # UI 与 3D 场景组件
│   ├── data/              # 遗产与地理数据
│   ├── shaders/           # GLSL 着色器
│   ├── state/             # 相机与场景状态机
│   ├── utils/             # 数学与颜色工具
│   └── workers/           # Web Worker 负载
└── docs/                  # 项目展示与设计文档
```

## 界面预览

项目附带 5 张界面截图，展示完整体验流程，位于 `docs/screenshots/`。

| 序号 | 场景 | 预览 |
| --- | --- | --- |
| 01 | 太空俯瞰地球全貌 | ![太空俯瞰地球全貌](docs/screenshots/01-overview.png) |
| 02 | 卫星底图俯瞰全球遗产分布 | ![卫星底图俯瞰全球遗产分布](docs/screenshots/02-globe-satellite.png) |
| 03 | 遗产地信息面板 | ![遗产地信息面板](docs/screenshots/03-info-panel.png) |
| 04 | 摄影特写：吉萨金字塔 | ![摄影特写：吉萨金字塔](docs/screenshots/04-closeup.png) |
| 05 | 地形模式四季色彩：中国长城 | ![地形模式四季色彩：中国长城](docs/screenshots/05-terrain-seasons.png) |

## 核心脚本

- `npm run dev`：启动 Vite 开发服务器
- `npm run build`：产出生产构建
- `npm run preview`：本地预览生产构建

## 许可

项目基于 MIT License 开源，详见 [LICENSE](LICENSE)。
