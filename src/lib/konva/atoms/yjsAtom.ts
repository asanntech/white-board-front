import * as Y from 'yjs'
import { UndoManager } from 'yjs'
import { atom } from 'jotai'
import { Drawing } from '../types'

export const YJS_ORIGIN = {
  DRAWING: 'drawing',
  DRAWING_END: 'drawingEnd',
  TRANSFORM: 'transform',
  REMOVE: 'remove',
  REMOTE: 'remote',
} as const

export type YjsOrigin = (typeof YJS_ORIGIN)[keyof typeof YJS_ORIGIN]

export const yDoc = new Y.Doc()

export const yDrawings = yDoc.getMap<Drawing>('drawings')

export const yDocAtom = atom(yDoc)
export const yDrawingsAtom = atom(yDrawings)

// trackedOriginsにローカル操作のoriginを指定して、自分の操作のみundo/redo対象にする
export const undoManager = new UndoManager(yDrawings, {
  trackedOrigins: new Set([YJS_ORIGIN.DRAWING, YJS_ORIGIN.DRAWING_END, YJS_ORIGIN.TRANSFORM, YJS_ORIGIN.REMOVE]),
})

export const undoManagerAtom = atom(undoManager)

export const undoAtom = atom(null, (get) => {
  const um = get(undoManagerAtom)
  um.undo()
})

export const redoAtom = atom(null, (get) => {
  const um = get(undoManagerAtom)
  um.redo()
})
