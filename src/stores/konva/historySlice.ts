import { StateCreator } from 'zustand'
import Konva from 'konva'
import { Drawing, UndoRedoResult } from '@/lib/konva/types'
import { KonvaStore } from './types'

const MAX_HISTORY_SIZE = 30

export type HistorySlice = {
  past: Konva.Node[][]
  present: Konva.Node[]
  future: Konva.Node[][]
  initHistory: (initialState: Konva.Node[]) => void
  pushToHistory: (newState: Konva.Node | Konva.Node[], clearHistory?: boolean) => void
  updateLine: (updateNodes: Konva.Node[]) => void
  removeLine: (id: string | string[], clearHistory?: boolean) => void
  undo: () => UndoRedoResult | undefined
  redo: () => UndoRedoResult | undefined
}

export const createHistorySlice: StateCreator<KonvaStore, [], [], HistorySlice> = (set, get) => ({
  past: [],
  present: [],
  future: [],

  initHistory: (initialState) =>
    set({
      past: [],
      present: initialState,
      future: [],
    }),

  pushToHistory: (newState, clearHistory = false) =>
    set((state) => {
      const newPresent = Array.isArray(newState) ? newState : [newState]
      return {
        past: !clearHistory ? [...state.past, state.present].slice(-MAX_HISTORY_SIZE) : [],
        present: [...state.present, ...newPresent],
        future: [],
      }
    }),

  updateLine: (updateNodes) =>
    set((state) => {
      const newPresent = state.present.map((node) => {
        const updateNode = updateNodes.find((n) => n.id() === node.id())
        return updateNode ?? node
      })
      return { present: newPresent }
    }),

  removeLine: (id, clearHistory = false) =>
    set((state) => {
      const idsToRemove = Array.isArray(id) ? id : [id]
      const newPresent = state.present.filter((node) => !idsToRemove.includes(node.id()))
      return {
        past: !clearHistory ? [...state.past, state.present].slice(-MAX_HISTORY_SIZE) : [],
        present: newPresent,
        future: [],
      }
    }),

  undo: () => {
    const state = get()
    if (state.past.length === 0) return undefined

    const previous = state.past[state.past.length - 1]

    set({
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    })

    const deletedObjects = extractDeletedObjects(state.present, previous)
    if (deletedObjects.objects.length > 0) return deletedObjects

    const restoredObjects = extractRestoredObjects(state.present, previous)
    if (restoredObjects.objects.length > 0) return restoredObjects

    const transformedObjects = extractTransformedObjects(state.present, previous)
    if (transformedObjects.objects.length > 0) return transformedObjects

    return undefined
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return undefined

    const next = state.future[0]

    set({
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    })

    const deletedObjects = extractDeletedObjects(state.present, next)
    if (deletedObjects.objects.length > 0) return deletedObjects

    const restoredObjects = extractRestoredObjects(state.present, next)
    if (restoredObjects.objects.length > 0) return restoredObjects

    const transformedObjects = extractTransformedObjects(state.present, next)
    if (transformedObjects.objects.length > 0) return transformedObjects

    return undefined
  },
})

// Selectors
export const selectLineNodes = (state: KonvaStore): Konva.Line[] => {
  const nodes = state.present.filter((node) => node instanceof Konva.Line)
  const uniqueNodes = new Map<string, Konva.Line>()

  nodes.reverse().forEach((node) => {
    if (!uniqueNodes.has(node.id())) {
      uniqueNodes.set(node.id(), node as Konva.Line)
    }
  })
  return Array.from(uniqueNodes.values()).reverse()
}

export const selectCanUndo = (state: KonvaStore) => state.past.length > 0
export const selectCanRedo = (state: KonvaStore) => state.future.length > 0

// Helper functions
function extractDeletedObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  const toIds = new Set(toState.map((node) => node.id()))
  const deletedObjects = fromState.filter((node) => !toIds.has(node.id()))
  const objects = deletedObjects.map((node) => node.attrs as Drawing)
  return { action: 'delete', objects }
}

function extractRestoredObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  const fromIds = new Set(fromState.map((node) => node.id()))
  const restoredObjects = toState.filter((node) => !fromIds.has(node.id()))
  const objects = restoredObjects.map((node) => node.attrs as Drawing)
  return { action: 'restore', objects }
}

function extractTransformedObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  const uniqueToNodesMap = new Map<string, Konva.Node>()
  toState.forEach((node) => {
    uniqueToNodesMap.set(node.id(), node)
  })

  const transformedObjects = fromState.filter((fromNode) => {
    const toNode = uniqueToNodesMap.get(fromNode.id())
    if (!toNode) return false

    return (
      fromNode.x() !== toNode.x() ||
      fromNode.y() !== toNode.y() ||
      fromNode.scaleX() !== toNode.scaleX() ||
      fromNode.scaleY() !== toNode.scaleY() ||
      fromNode.rotation() !== toNode.rotation()
    )
  })

  const transformedIds = transformedObjects.map((node) => node.id())
  const objects = transformedIds.map((id) => uniqueToNodesMap.get(id)!.attrs as Drawing)
  return { action: 'transform', objects }
}
