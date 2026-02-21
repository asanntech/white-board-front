import { StateCreator } from 'zustand'
import * as Y from 'yjs'
import Konva from 'konva'
import { Drawing } from '../types'
import { KonvaStore } from './types'

export type YjsSlice = {
  yDoc: Y.Doc | null
  undoManager: Y.UndoManager | null
  isYjsSynced: boolean
  yjsVersion: number

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
    yjsVersion: 0,

    initYjs: () => {
      const currentDoc = get().yDoc
      if (currentDoc) {
        currentDoc.destroy()
      }

      const doc = new Y.Doc()
      const drawings = doc.getMap<Drawing>('drawings')

      // 'local'オリジンの操作のみUndoManagerで追跡
      // captureTimeout: 0 で各操作を個別のundo項目として記録
      const undoManager = new Y.UndoManager(drawings, {
        trackedOrigins: new Set(['local']),
        captureTimeout: 0,
      })

      // ローカル操作およびundo/redo時にSocket送信
      doc.on('update', (update: Uint8Array, origin: unknown) => {
        // UndoManagerはundo/redo時に自身をoriginとして使用する
        if (origin === 'local' || origin === undoManager) {
          emitYjsUpdate(update)
        }
      })

      set({ yDoc: doc, undoManager, isYjsSynced: false })
    },

    applyInitialState: (state: Uint8Array) => {
      const doc = get().yDoc
      if (!doc) return

      Y.applyUpdate(doc, state)
      set((s) => ({ isYjsSynced: true, yjsVersion: s.yjsVersion + 1 }))
    },

    applyUpdate: (update: Uint8Array) => {
      const doc = get().yDoc
      if (!doc) return

      // リモートからの更新はUndoManagerで追跡しない
      Y.applyUpdate(doc, update, 'remote')
      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
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

      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
    },

    updateDrawing: (drawing: Drawing) => {
      const doc = get().yDoc
      if (!doc) return

      const drawings = doc.getMap<Drawing>('drawings')

      doc.transact(() => {
        drawings.set(drawing.id, drawing)
      }, 'local')

      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
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

      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
    },

    yjsUndo: () => {
      const undoManager = get().undoManager
      if (!undoManager) return

      undoManager.undo()
      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
    },

    yjsRedo: () => {
      const undoManager = get().undoManager
      if (!undoManager) return

      undoManager.redo()
      set((state) => ({ yjsVersion: state.yjsVersion + 1 }))
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

export const selectDrawings = (state: KonvaStore): Drawing[] => {
  // yjsVersionを参照してZustandの再レンダリングをトリガー
  void state.yjsVersion
  const doc = state.yDoc
  if (!doc) return []

  const drawings = doc.getMap<Drawing>('drawings')
  return Array.from(drawings.values())
}

export const selectLineNodes = (state: KonvaStore): Konva.Line[] => {
  return selectDrawings(state).map((drawing) => new Konva.Line(drawing))
}

export const selectCanYjsUndo = (state: KonvaStore): boolean => {
  // yjsVersionを参照してZustandの再レンダリングをトリガー
  void state.yjsVersion
  return state.undoManager?.canUndo() ?? false
}

export const selectCanYjsRedo = (state: KonvaStore): boolean => {
  // yjsVersionを参照してZustandの再レンダリングをトリガー
  void state.yjsVersion
  return state.undoManager?.canRedo() ?? false
}
