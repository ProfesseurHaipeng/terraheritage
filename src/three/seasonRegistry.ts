// 季节着色注册表：地球材质在 onBeforeCompile 中注入季节 uniform 后在此登记，
// SeasonLayer 每帧读取并平滑推进月份对应的冬夏/旱雨强度
import type { WebGLProgramParametersWithUniforms } from 'three';

export const seasonRegistry: { current: WebGLProgramParametersWithUniforms | null } = {
  current: null,
};

export function registerOceanShader(shader: WebGLProgramParametersWithUniforms): void {
  seasonRegistry.current = shader;
}

export function unregisterOceanShader(): void {
  seasonRegistry.current = null;
}
