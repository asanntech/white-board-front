import { create } from 'zustand'
import { KonvaStore } from '../stores/types'
import { createCanvasSlice } from '../stores/canvasSlice'
import { createToolSlice } from '../stores/toolSlice'
import { createKeyboardSlice, selectIsSpacePressed } from '../stores/keyboardSlice'
import { createSocketSlice } from '../stores/socketSlice'
import { createYjsSlice, selectLineNodes, selectCanYjsUndo, selectCanYjsRedo } from '../stores/yjsSlice'
import type { ClientToServerEvents } from '../stores/socketSlice'

export const useWhiteboardStore = create<KonvaStore>()((...a) => ({
  ...createCanvasSlice(...a),
  ...createToolSlice(...a),
  ...createKeyboardSlice(...a),
  ...createSocketSlice(...a),
  ...createYjsSlice(...a),
}))

export { selectIsSpacePressed, selectLineNodes, selectCanYjsUndo, selectCanYjsRedo }
export type { ClientToServerEvents }
