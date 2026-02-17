import { LineCap, LineJoin } from 'konva/lib/Shape'

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
  lineCap?: LineCap
  lineJoin?: LineJoin
  opacity?: number
}

// Yjs payload types
export type YjsUpdatePayload = {
  roomId: string
  update: string // Base64 encoded
}

export type YjsSyncInitPayload = {
  roomId: string
  state: string // Base64 encoded
}
