import * as Y from 'yjs'
import { UndoManager } from 'yjs'
import { atom } from 'jotai'
import { Drawing } from '../types'

export const yDoc = new Y.Doc()

export const yDrawings = yDoc.getMap<Drawing>('drawings')

export const yDocAtom = atom(yDoc)
export const yDrawingsAtom = atom(yDrawings)

// trackedOriginsに'local'を指定することで、自分の操作のみundo/redo対象にする
const undoManager = new UndoManager(yDrawings, {
  trackedOrigins: new Set(['local']),
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

export const canUndoAtom = atom((get) => {
  const um = get(undoManagerAtom)
  return um.undoStack.length > 0
})

export const canRedoAtom = atom((get) => {
  const um = get(undoManagerAtom)
  return um.redoStack.length > 0
})
