import { StateCreator } from 'zustand'
import { Tool } from '../types'
import { KonvaStore } from './types'

export type ToolSlice = {
  tool: Tool
  setTool: (tool: Tool) => void
}

export const createToolSlice: StateCreator<KonvaStore, [], [], ToolSlice> = (set) => ({
  tool: 'select',
  setTool: (tool) => set({ tool }),
})
