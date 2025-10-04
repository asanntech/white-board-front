import { atom } from 'jotai'
import Konva from 'konva'
import { Drawing } from '../types'

// 描画オブジェクトの履歴管理
const MAX_HISTORY_SIZE = 30

// 履歴の状態を管理するatom
const historyAtom = atom<{
  past: Konva.Node[][]
  present: Konva.Node[]
  future: Konva.Node[][]
}>({
  past: [],
  present: [],
  future: [],
})

// Lineオブジェクトを取得
export const lineNodesAtom = atom<Konva.Line[]>((get) => {
  const nodes = get(historyAtom).present.filter((node) => node instanceof Konva.Line)
  const uniqueNodes = new Map()

  // 後のノードで上書きするために逆順で処理
  nodes.reverse().forEach((node) => {
    if (!uniqueNodes.has(node.id())) {
      uniqueNodes.set(node.id(), node)
    }
  })
  return Array.from(uniqueNodes.values()).reverse()
})

export const initHistoryAtom = atom(null, (get, set, initialState: Konva.Node[]) => {
  set(historyAtom, {
    past: [],
    present: initialState,
    future: [],
  })
})

// 新しい状態を履歴に追加
export const pushToHistoryAtom = atom(null, (get, set, newState: Konva.Node | Konva.Node[], clearHistory?: boolean) => {
  const current = get(historyAtom)

  const newPresent = Array.isArray(newState) ? newState : [newState]

  const newHistory = {
    past: !clearHistory ? [...current.past, current.present].slice(-MAX_HISTORY_SIZE) : [],
    present: [...current.present, ...newPresent],
    future: [], // 新しい状態を追加したら、futureはクリア
  }
  set(historyAtom, newHistory)
})

export const updateLineAtom = atom(null, (get, set, updateNodes: Konva.Node[]) => {
  const current = get(historyAtom)

  const newPresent = current.present.map((node) => {
    const updateNode = updateNodes.find((updateNode) => updateNode.id() === node.id())
    if (updateNode) return updateNode
    return node
  })

  set(historyAtom, { ...current, present: newPresent })
})

// 現在の描画オブジェクトから指定したIDのオブジェクトを削除
export const removeLineAtom = atom(null, (get, set, id: string | string[], clearHistory?: boolean) => {
  const current = get(historyAtom)

  // 単一のIDまたは複数のIDに対応
  const idsToRemove = Array.isArray(id) ? id : [id]
  const newPresent = current.present.filter((node) => !idsToRemove.includes(node.id()))

  const newHistory = {
    past: !clearHistory ? [...current.past, current.present].slice(-MAX_HISTORY_SIZE) : [],
    present: newPresent,
    future: [], // 新しい状態を追加したら、futureはクリア
  }
  set(historyAtom, newHistory)
})

export const undoAtom = atom(null, (get, set) => {
  const current = get(historyAtom)
  if (current.past.length === 0) return

  const previous = current.past[current.past.length - 1]
  const newHistory = {
    past: current.past.slice(0, -1),
    present: previous,
    future: [current.present, ...current.future],
  }
  set(historyAtom, newHistory)

  // 削除されたオブジェクトを抽出
  const deletedObjects = extractDeletedObjects(current.present, previous)
  if (deletedObjects.objects.length > 0) {
    return deletedObjects
  }

  // 復元されたオブジェクトを抽出
  const restoredObjects = extractRestoredObjects(current.present, previous)
  if (restoredObjects.objects.length > 0) {
    return restoredObjects
  }

  // 変形されたオブジェクトを抽出
  const transformedObjects = extractTransformedObjects(current.present, previous)
  if (transformedObjects.objects.length > 0) {
    return transformedObjects
  }
})

// redo操作
export const redoAtom = atom(null, (get, set) => {
  const current = get(historyAtom)
  if (current.future.length === 0) return

  const next = current.future[0]
  const newHistory = {
    past: [...current.past, current.present],
    present: next,
    future: current.future.slice(1),
  }
  set(historyAtom, newHistory)

  // 削除されたオブジェクトを抽出
  const deletedObjects = extractDeletedObjects(current.present, next)
  if (deletedObjects.objects.length > 0) {
    return deletedObjects
  }

  // 復元されたオブジェクトを抽出
  const restoredObjects = extractRestoredObjects(current.present, next)
  if (restoredObjects.objects.length > 0) {
    return restoredObjects
  }

  // 変形されたオブジェクトを抽出
  const transformedObjects = extractTransformedObjects(current.present, next)
  if (transformedObjects.objects.length > 0) {
    return transformedObjects
  }
})

// undo可能かどうか
export const canUndoAtom = atom((get) => get(historyAtom).past.length > 0)

// redo可能かどうか
export const canRedoAtom = atom((get) => get(historyAtom).future.length > 0)

interface UndoRedoResult {
  action: 'delete' | 'restore' | 'transform'
  objects: Drawing[]
}

// 削除されたオブジェクトを抽出する共通関数
function extractDeletedObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  const toIds = new Set(toState.map((node) => node.id()))
  const deletedObjects = fromState.filter((node) => !toIds.has(node.id()))
  const objects = deletedObjects.map((node) => node.attrs as Drawing)
  return { action: 'delete', objects }
}

// 復元されたオブジェクトを抽出する共通関数
function extractRestoredObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  const fromIds = new Set(fromState.map((node) => node.id()))
  const restoredObjects = toState.filter((node) => !fromIds.has(node.id()))
  const objects = restoredObjects.map((node) => node.attrs as Drawing)
  return { action: 'restore', objects }
}

// 変形されたオブジェクトを抽出する共通関数
function extractTransformedObjects(fromState: Konva.Node[], toState: Konva.Node[]): UndoRedoResult {
  // 同じIDが存在する場合、最も新しい（配列の後ろにある）オブジェクトのみを保持
  const uniqueToNodesMap = new Map<string, Konva.Node>()
  toState.forEach((node) => {
    uniqueToNodesMap.set(node.id(), node)
  })

  const transformedObjects = fromState.filter((fromNode) => {
    const toNode = uniqueToNodesMap.get(fromNode.id())
    if (!toNode) return false

    // プロパティを比較して変更があったかチェック
    return (
      fromNode.x() !== toNode.x() ||
      fromNode.y() !== toNode.y() ||
      fromNode.scaleX() !== toNode.scaleX() ||
      fromNode.scaleY() !== toNode.scaleY() ||
      fromNode.rotation() !== toNode.rotation()
    )
  })

  // 変形されたオブジェクトのIDを取得し、toStateから最も新しいオブジェクトを取得
  const transformedIds = transformedObjects.map((node) => node.id())
  const objects = transformedIds.map((id) => uniqueToNodesMap.get(id)!.attrs as Drawing)
  return { action: 'transform', objects }
}
