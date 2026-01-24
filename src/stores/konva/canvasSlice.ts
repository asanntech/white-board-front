import { StateCreator } from 'zustand'
import { KonvaStore } from './types'

export type CanvasSlice = {
  isReadyCanvas: boolean
  setIsReadyCanvas: (isReady: boolean) => void
}

export const createCanvasSlice: StateCreator<KonvaStore, [], [], CanvasSlice> = (set) => ({
  isReadyCanvas: false,
  setIsReadyCanvas: (isReady) => set({ isReadyCanvas: isReady }),
})
