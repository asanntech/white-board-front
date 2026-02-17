import { StateCreator } from 'zustand'
import * as Y from 'yjs'
import { Drawing } from '../types'
import { KonvaStore } from './types'

export type YjsSlice = {
  yDoc: Y.Doc | null
  undoManager: Y.UndoManager | null
  isYjsSynced: boolean

  initYjs: () => void
  applyInitialState: (state: Uint8Array) => void
  applyUpdate: (update: Uint8Array) => void
  destroyYjs: () => void

  addDrawing: (drawing: Drawing) => void
  updateDrawing: (drawing: Drawing) => void
  removeDrawings: (ids: string[]) => void

  yjsUndo: () => void
  yjsRedo: () => void
  canYjsUndo: () => boolean
  canYjsRedo: () => boolean
}

export function encodeUpdate(update: Uint8Array): string {
  return btoa(String.fromCharCode(...update))
}

export function decodeUpdate(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export const createYjsSlice: StateCreator<KonvaStore, [], [], YjsSlice> = (set, get) => {
  const emitYjsUpdate = (update: Uint8Array) => {
    const { socket, roomId } = get()
    if (!socket || !roomId) return

    socket.emit('yjs-update', {
      roomId,
      update: encodeUpdate(update),
    })
  }

  return {
    yDoc: null,
    undoManager: null,
    isYjsSynced: false,

    initYjs: () => {
      const currentDoc = get().yDoc
      if (currentDoc) {
        currentDoc.destroy()
      }

      const doc = new Y.Doc()
      const drawings = doc.getMap<Drawing>('drawings')

      // 'local'オリジンの操作のみUndoManagerで追跡
      const undoManager = new Y.UndoManager(drawings, {
        trackedOrigins: new Set(['local']),
      })

      // ローカル、undo、redo操作時にSocket送信
      doc.on('update', (update: Uint8Array, origin: unknown) => {
        if (origin === 'local' || origin === 'undo' || origin === 'redo') {
          emitYjsUpdate(update)
        }
      })

      set({ yDoc: doc, undoManager, isYjsSynced: false })
    },

    applyInitialState: (state: Uint8Array) => {
      const doc = get().yDoc
      if (!doc) return

      Y.applyUpdate(doc, state)
      set({ isYjsSynced: true })
    },

    applyUpdate: (update: Uint8Array) => {
      const doc = get().yDoc
      if (!doc) return

      // リモートからの更新はUndoManagerで追跡しない
      Y.applyUpdate(doc, update, 'remote')
    },

    destroyYjs: () => {
      const doc = get().yDoc
      const undoManager = get().undoManager

      if (undoManager) {
        undoManager.destroy()
      }
      if (doc) {
        doc.destroy()
      }

      set({ yDoc: null, undoManager: null, isYjsSynced: false })
    },

    addDrawing: (drawing: Drawing) => {
      const doc = get().yDoc
      if (!doc) return

      const drawings = doc.getMap<Drawing>('drawings')

      doc.transact(() => {
        drawings.set(drawing.id, drawing)
      }, 'local')
    },

    updateDrawing: (drawing: Drawing) => {
      const doc = get().yDoc
      if (!doc) return

      const drawings = doc.getMap<Drawing>('drawings')

      doc.transact(() => {
        drawings.set(drawing.id, drawing)
      }, 'local')
    },

    removeDrawings: (ids: string[]) => {
      const doc = get().yDoc
      if (!doc) return

      const drawings = doc.getMap<Drawing>('drawings')

      doc.transact(() => {
        ids.forEach((id) => {
          drawings.delete(id)
        })
      }, 'local')
    },

    yjsUndo: () => {
      const undoManager = get().undoManager
      const doc = get().yDoc
      if (!undoManager || !doc) return

      doc.transact(() => {
        undoManager.undo()
      }, 'undo')
    },

    yjsRedo: () => {
      const undoManager = get().undoManager
      const doc = get().yDoc
      if (!undoManager || !doc) return

      doc.transact(() => {
        undoManager.redo()
      }, 'redo')
    },

    canYjsUndo: () => {
      const undoManager = get().undoManager
      return undoManager?.canUndo() ?? false
    },

    canYjsRedo: () => {
      const undoManager = get().undoManager
      return undoManager?.canRedo() ?? false
    },
  }
}

export const selectYjsDrawings = (state: KonvaStore): Drawing[] => {
  const doc = state.yDoc
  if (!doc) return []

  const drawings = doc.getMap<Drawing>('drawings')
  return Array.from(drawings.values())
}

export const selectCanYjsUndo = (state: KonvaStore): boolean => {
  return state.undoManager?.canUndo() ?? false
}

export const selectCanYjsRedo = (state: KonvaStore): boolean => {
  return state.undoManager?.canRedo() ?? false
}
