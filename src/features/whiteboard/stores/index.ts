import { create } from 'zustand'
import { KonvaStore } from './types'
import { createCanvasSlice } from './canvasSlice'
import { createToolSlice } from './toolSlice'
import { createKeyboardSlice } from './keyboardSlice'
import { createHistorySlice } from './historySlice'
import { createSocketSlice } from './socketSlice'

export const useWhiteboardStore = create<KonvaStore>()((...a) => ({
  ...createCanvasSlice(...a),
  ...createToolSlice(...a),
  ...createKeyboardSlice(...a),
  ...createHistorySlice(...a),
  ...createSocketSlice(...a),
}))

export { selectIsSpacePressed } from './keyboardSlice'
export { selectLineNodes, selectCanUndo, selectCanRedo } from './historySlice'
export type { ClientToServerEvents } from './socketSlice'
