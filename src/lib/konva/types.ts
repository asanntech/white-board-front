export type Tool = 'select' | 'pen' | 'redPen' | 'marker' | 'eraser'

export type Drawing = Extract<Tool, 'pen' | 'redPen' | 'marker' | 'eraser'>

export interface DrawingObject {
  id: string
  type: Drawing
  points: number[]
}
