export const COLORS = {
  // 共通色
  COMMON: {
    TRANSPARENT: 'transparent',
  },

  // ホワイトボード関連
  WHITEBOARD: {
    BACKGROUND: '#F2F2F2',
    GRID_LINE: '#E9E9E9',
    GRID_LINE_BOLD: '#DFDFDF',
  },
} as const

export type ColorKey = keyof typeof COLORS
export type ColorValue = (typeof COLORS)[ColorKey]
