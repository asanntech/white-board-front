import { atom } from 'jotai'
import { Tool, DrawingObject } from '../types'

// ツール状態
export const toolAtom = atom<Tool>('select')

// 履歴管理
const MAX_HISTORY_SIZE = 50

// 履歴の状態を管理するatom
export const historyAtom = atom<{
  past: DrawingObject[][]
  present: DrawingObject[]
  future: DrawingObject[][]
}>({
  past: [],
  present: [],
  future: [],
})

// 現在の描画オブジェクトを取得
export const currentDrawingObjectsAtom = atom((get) => get(historyAtom).present)

// 新しい状態を履歴に追加
export const pushToHistoryAtom = atom(null, (get, set, newState: DrawingObject[]) => {
  const current = get(historyAtom)
  const newHistory = {
    past: [...current.past, current.present].slice(-MAX_HISTORY_SIZE),
    present: newState,
    future: [], // 新しい状態を追加したら、futureはクリア
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
