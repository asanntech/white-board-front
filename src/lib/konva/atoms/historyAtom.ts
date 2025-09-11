import { atom } from 'jotai'
import Konva from 'konva'

// 履歴管理
const MAX_HISTORY_SIZE = 50

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
export const lineNodesAtom = atom((get) => {
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

// 新しい状態を履歴に追加
export const pushToHistoryAtom = atom(null, (get, set, newState: Konva.Node) => {
  const current = get(historyAtom)
  const newHistory = {
    past: [...current.past, current.present].slice(-MAX_HISTORY_SIZE),
    present: [...current.present, newState],
    future: [], // 新しい状態を追加したら、futureはクリア
  }
  set(historyAtom, newHistory)
})

// Lineオブジェクトに座標を追加
export const addPointsToLineAtom = atom(null, (get, set, id: string, points: number[]) => {
  const current = get(historyAtom)

  const newPresent = current.present.map((node) => {
    if (node.id() !== id) return node
    const line = node as Konva.Line
    line.points([...line.points(), ...points])
    return line
  })
  set(historyAtom, { ...current, present: newPresent })
})

// 現在の描画オブジェクトから指定したIDのオブジェクトを削除
export const removeLineAtom = atom(null, (get, set, id: string | string[]) => {
  const current = get(historyAtom)

  // 単一のIDまたは複数のIDに対応
  const idsToRemove = Array.isArray(id) ? id : [id]
  const newPresent = current.present.filter((node) => !idsToRemove.includes(node.id()))

  const newHistory = {
    past: [...current.past, current.present],
    present: newPresent,
    future: [],
  }
  set(historyAtom, newHistory)
})

// undo操作
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
})

// undo可能かどうか
export const canUndoAtom = atom((get) => get(historyAtom).past.length > 0)

// redo可能かどうか
export const canRedoAtom = atom((get) => get(historyAtom).future.length > 0)
