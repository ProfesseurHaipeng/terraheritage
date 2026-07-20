/**
 * 业务数据统一出口 —— UI 与 3D 层只从这里取数。
 * 全部内容为示例数据(reviewStatus: 'draft',待审核)。
 */
export { countries } from './countries';
export { regions, regionById } from './regions';
export { plants, plantById } from './plants';
export { cultures, cultureById } from './cultures';
export { medicine, medicineById } from './medicine';
export { routes, routeById } from './routes';
export { sources, sourceById } from './sources';
export { authoritySources, datasetSources } from './registry';
export { plantCandidates, animalCandidates, cultureCandidates, medicineTopicCandidates, conservationTopicCandidates, pilotCandidates } from './pilot/candidates';

import { countries } from './countries';
import { regions } from './regions';
import { plants } from './plants';
import { cultures } from './cultures';
import { medicine } from './medicine';
import { routes } from './routes';
import { sources } from './sources';

/** 首页统计行:从实际数据计算 */
export const stats = {
  countries: countries.length,
  plants: plants.length,
  cultures: cultures.length,
  medicine: medicine.length,
  sources: sources.length,
  regions: regions.length,
  routes: routes.length,
};
