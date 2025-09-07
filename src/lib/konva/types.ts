export type Tool = 'select' | 'pen' | 'marker' | 'eraser'

export type Drawing = Extract<Tool, 'pen' | 'marker' | 'eraser'>

export interface DrawingObject {
  id: string
  type: Drawing
  points: number[]
}
