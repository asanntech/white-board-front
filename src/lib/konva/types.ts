export type Tool = 'select' | 'pen' | 'redPen' | 'marker' | 'eraser'

export type Drawing = {
  id: string
  type: string
  points: number[]
  stroke: string
  strokeWidth: number
  x?: number
  y?: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
}
