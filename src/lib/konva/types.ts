export type Tool = 'select' | 'drawing' | 'text' | 'shape'

export type Drawing = 'pen' | 'brush' | 'eraser'

export interface DrawingObject {
  id: string
  type: Drawing
  points: number[]
}
