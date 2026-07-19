/**
 * R3F Canvas 容器 —— DESIGN.md §4。
 * dpr 随画质档(高 ≤2 / 平衡 ≤1.5 / 节能 1)、antialias、
 * 错误边界(3D 崩溃时给出中文兜底文案)+ Suspense 加载态。
 * 点击空白宇宙(未命中任何物体)时取消国家选中。
 */
import { Component, Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import type { StoryRoute } from '@/types';
import { QUALITY_SPECS } from '@/lib/quality';
import { useAppStore } from '@/stores/appStore';
import Stars from './Stars';
import Earth from './Earth';
import SeasonLayer from './SeasonLayer';
import RouteArcs from './RouteArcs';
import Markers, { type MarkerSpec } from './Markers';
import CameraRig from './CameraRig';

/** 3D 错误边界:WebGL 失败/渲染异常时降级为静态文案 */
class GlobeErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#05080F] px-8 text-center">
          <div>
            <p className="font-display text-lg">3D 渲染初始化失败</p>
            <p className="mt-2 text-sm text-paper-dim">
              你的浏览器或设备可能不支持 WebGL。请尝试更换浏览器,或在设置中降低画质。
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface GlobeCanvasProps {
  /** 历史路线(可空,数据由后续阶段填充) */
  routes?: StoryRoute[];
  /** 内容标记点(可空) */
  markers?: MarkerSpec[];
  /** 历史路线图层开关 */
  routesVisible?: boolean;
  onMarkerSelect?: (id: string) => void;
}

export default function GlobeCanvas({
  routes = [],
  markers = [],
  routesVisible = true,
  onMarkerSelect,
}: GlobeCanvasProps) {
  const quality = useAppStore((s) => s.quality);
  const spec = QUALITY_SPECS[quality];

  return (
    <GlobeErrorBoundary>
      <Canvas
        dpr={[1, spec.dpr]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 42, near: 0.05, far: 300, position: [0, 0, 6] }}
        onPointerMissed={() => useAppStore.getState().selectCountry(null)}
      >
        <color attach="background" args={['#05080F']} />
        <Suspense fallback={null}>
          <Stars count={spec.stars} />
          <Earth spec={spec} />
          <SeasonLayer />
          <RouteArcs routes={routes} visible={routesVisible} />
          <Markers markers={markers} onSelect={onMarkerSelect} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </GlobeErrorBoundary>
  );
}
