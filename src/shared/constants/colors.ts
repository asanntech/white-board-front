export const COLORS = {
  // 共通色
  COMMON: {
    TRANSPARENT: 'transparent',
  },
} as const

export type ColorKey = keyof typeof COLORS
export type ColorValue = (typeof COLORS)[ColorKey]
