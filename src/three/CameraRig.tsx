/**
 * 镜头系统 —— DESIGN.md §3.3 / §4 CameraRig。
 *  - 开场推进:z = 6 → 2.6,3.5s,easeInOutCubic(减少动态:瞬移)
 *  - 飞行:store.flyTo(lat,lng) 触发,slerp 方向插值 + 半径过渡到 R*1.9,
 *    1.8s,easeInOutCubic;飞行中锁定 OrbitControls 输入
 *  - resetView():半径回到 2.6(保持当前方向)
 *  - OrbitControls:damping 0.1、禁平移、1.35R–4.2R;
 *    change 时按 altitude(= camera.position.length(),R 为单位)缩放
 *    rotateSpeed = altitude*0.25、zoomSpeed = (altitude+1)*0.12;
 *    空闲 4s 恢复自转(360°/120s ⇔ autoRotateSpeed 0.5),交互即停;
 *    减少动态:全部瞬移、禁自转
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { easeInOutCubic, latLngToVec3, slerp } from '@/lib/geo';
import { useAppStore } from '@/stores/appStore';

/** 开场推进起止 z 值 */
const INTRO_FROM = 6;
const INTRO_TO = 2.6;
/** 飞行目标半径(聚焦国家) */
const FLIGHT_RADIUS = 1.9;
/** 自转速度:three 约定 autoRotateSpeed 2.0 ⇔ 30s/圈 → 0.5 ⇔ 120s/圈 */
const AUTO_ROTATE_SPEED = 0.5;
/** 空闲多少秒后恢复自转 */
const IDLE_RESUME_S = 4;

/** 进行中的相机动画(slerp 方向 + 半径过渡) */
interface CameraAnim {
  t: number; // 已进行秒数
  dur: number;
  fromDir: THREE.Vector3;
  toDir: THREE.Vector3;
  fromR: number;
  toR: number;
}

export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const flight = useAppStore((s) => s.flight);
  const resetNonce = useAppStore((s) => s.resetNonce);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const autoRotatePref = useAppStore((s) => s.autoRotate);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const anim = useRef<CameraAnim | null>(null);
  /** 开场推进进度 0→1(减少动态直接为 1) */
  const intro = useRef(reducedMotion ? 1 : 0);
  /** 最近一次用户交互时刻(useFrame clock 秒) */
  const lastInteract = useRef(-IDLE_RESUME_S);

  // 减少动态:开场直接到位
  useEffect(() => {
    if (reducedMotion) {
      camera.position.set(0, 0, INTRO_TO);
      camera.lookAt(0, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 飞行请求(nonce 变化触发)
  useEffect(() => {
    if (!flight) return;
    const toDir = latLngToVec3(flight.lat, flight.lng).normalize();
    if (reducedMotion) {
      camera.position.copy(toDir.clone().multiplyScalar(FLIGHT_RADIUS));
      camera.lookAt(0, 0, 0);
      return;
    }
    anim.current = {
      t: 0,
      dur: 1.8,
      fromDir: camera.position.clone().normalize(),
      toDir,
      fromR: camera.position.length(),
      toR: FLIGHT_RADIUS,
    };
    if (controlsRef.current) controlsRef.current.enabled = false; // 飞行中锁定输入
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight?.nonce]);

  // 回全球视角(保持当前方向,半径回 2.6)
  useEffect(() => {
    if (resetNonce === 0) return;
    const dir = camera.position.clone().normalize();
    if (reducedMotion) {
      camera.position.copy(dir.multiplyScalar(INTRO_TO));
      camera.lookAt(0, 0, 0);
      return;
    }
    anim.current = {
      t: 0,
      dur: 1.8,
      fromDir: dir.clone(),
      toDir: dir,
      fromR: camera.position.length(),
      toR: INTRO_TO,
    };
    if (controlsRef.current) controlsRef.current.enabled = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  useFrame((_, dt) => {
    const controls = controlsRef.current;

    // 1) 开场推进
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + dt / 3.5);
      const z = THREE.MathUtils.lerp(INTRO_FROM, INTRO_TO, easeInOutCubic(intro.current));
      camera.position.set(0, 0, z);
      camera.lookAt(0, 0, 0);
      if (controls) controls.enabled = intro.current >= 1;
    }

    // 2) 飞行 / 回全球
    const a = anim.current;
    if (a) {
      a.t += dt;
      const done = a.t >= a.dur;
      const e = easeInOutCubic(Math.min(1, a.t / a.dur));
      const dir = slerp(a.fromDir, a.toDir, e);
      const r = THREE.MathUtils.lerp(a.fromR, a.toR, e);
      camera.position.copy(dir.multiplyScalar(r));
      camera.lookAt(0, 0, 0);
      if (done) {
        anim.current = null;
        if (controls) controls.enabled = true; // 解锁输入
      }
    }

    // 3) 自转:偏好开启 + 非减少动态 + 无动画 + 空闲 4s
    if (controls) {
      const busy = intro.current < 1 || anim.current !== null;
      const idleFor = performance.now() / 1000 - lastInteract.current;
      controls.autoRotate = autoRotatePref && !reducedMotion && !busy && idleFor > IDLE_RESUME_S;
      controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.1}
      enablePan={false}
      minDistance={1.35} // R*1.35
      maxDistance={4.2} // R*4.2
      onStart={() => {
        lastInteract.current = Infinity; // 交互中:不自转
      }}
      onEnd={() => {
        lastInteract.current = performance.now() / 1000; // 从此刻起计空闲
      }}
      onChange={() => {
        const c = controlsRef.current;
        if (!c) return;
        // 速度随高度缩放(altitude = camera.position.length(),以 R 为单位)
        const altitude = camera.position.length();
        c.rotateSpeed = altitude * 0.25;
        c.zoomSpeed = (altitude + 1) * 0.12;
      }}
    />
  );
}
