import { StateCreator } from 'zustand'
import { KonvaStore } from './types'

export type KeyboardSlice = {
  keyPressState: Record<string, boolean>
  setKeyPress: (code: string, pressed: boolean) => void
  clearKeyPressState: () => void
}

export const createKeyboardSlice: StateCreator<KonvaStore, [], [], KeyboardSlice> = (set) => ({
  keyPressState: {},
  setKeyPress: (code, pressed) =>
    set((state) => ({
      keyPressState: { ...state.keyPressState, [code]: pressed },
    })),
  clearKeyPressState: () => set({ keyPressState: {} }),
})

export const selectIsSpacePressed = (state: KonvaStore) => state.keyPressState['Space'] || false
