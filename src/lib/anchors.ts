/**
 * 传统医学体系的球面锚点(DESIGN.md §15 给定)。
 * 医学体系本身无精确地理边界,锚点仅用于镜头飞行与标记显示。
 */
export const MEDICINE_ANCHORS: Record<string, [number, number]> = {
  tcm: [35, 105],
  'tibetan-medicine': [29.7, 91.1],
  'dai-medicine': [21.9, 100.8],
  ayurveda: [10.5, 76.2],
};
