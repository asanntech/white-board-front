import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { atom } from 'jotai'
import { Drawing } from '../konva/types'

// 基本Atom
export const yDocAtom = atom<Y.Doc | null>(null)
export const yDrawingsAtom = atom<Y.Map<Drawing> | null>(null)
export const yUndoManagerAtom = atom<Y.UndoManager | null>(null)
export const yjsConnectionAtom = atom<boolean>(false)
export const yjsErrorAtom = atom<string | null>(null)

// WebSocketプロバイダーAtom
export const wsProviderAtom = atom<WebsocketProvider | null>(null)

// 初期化Atom
export const initYjsAtom = atom(null, (get, set, roomId: string, token: string) => {
  // 既存の接続をクリーンアップ
  const existingProvider = get(wsProviderAtom)
  if (existingProvider) {
    existingProvider.destroy()
  }

  // 既存のY.Docを破棄
  const existingYDoc = get(yDocAtom)
  if (existingYDoc) {
    existingYDoc.destroy()
  }

  const ydoc = new Y.Doc()
  const yDrawings = ydoc.getMap<Drawing>('drawings')

  const wsProvider = new WebsocketProvider(process.env.NEXT_PUBLIC_YJS_WS_URL!, roomId, ydoc, { params: { token } })

  // 接続状態の管理
  wsProvider.on('status', ({ status }: { status: string }) => {
    set(yjsConnectionAtom, status === 'connected')
    if (status === 'disconnected') {
      set(yjsErrorAtom, 'Connection lost')
    } else {
      set(yjsErrorAtom, null)
    }
  })

  // UndoManager設定
  const undoManager = new Y.UndoManager(yDrawings, {
    trackedOrigins: new Set([null]), // trackedOriginsにnullを設定することで、ローカルの変更のみをundo/redo対象にする
  })

  set(yDocAtom, ydoc)
  set(yDrawingsAtom, yDrawings)
  set(yUndoManagerAtom, undoManager)
  set(wsProviderAtom, wsProvider)

  // Y.Mapの変更を監視して、更新カウンターをインクリメント
  yDrawings.observe(() => {
    set(yDrawingsUpdateAtom, (prev) => prev + 1)
  })
})

// 切断Atom
export const disconnectYjsAtom = atom(null, (get, set) => {
  const wsProvider = get(wsProviderAtom)
  if (wsProvider) {
    wsProvider.destroy()
  }

  // Y.Docを破棄
  const ydoc = get(yDocAtom)
  if (ydoc) {
    ydoc.destroy()
  }

  set(yDocAtom, null)
  set(yDrawingsAtom, null)
  set(yUndoManagerAtom, null)
  set(wsProviderAtom, null)
  set(yjsConnectionAtom, false)
  set(yjsErrorAtom, null)
})

// Undo/Redo実装
export const undoAtom = atom(null, (get) => {
  const undoManager = get(yUndoManagerAtom)
  undoManager?.undo()
})

export const redoAtom = atom(null, (get) => {
  const undoManager = get(yUndoManagerAtom)
  undoManager?.redo()
})

export const canUndoAtom = atom((get) => {
  const undoManager = get(yUndoManagerAtom)
  return undoManager ? undoManager.undoStack.length > 0 : false
})

export const canRedoAtom = atom((get) => {
  const undoManager = get(yUndoManagerAtom)
  return undoManager ? undoManager.redoStack.length > 0 : false
})

// 描画操作のYjs API対応
// 描画追加
export const addDrawingAtom = atom(null, (get, set, drawing: Drawing) => {
  const yDrawings = get(yDrawingsAtom)
  yDrawings?.set(drawing.id, drawing)
})

// 描画更新
export const updateDrawingAtom = atom(null, (get, set, drawing: Drawing) => {
  const yDrawings = get(yDrawingsAtom)
  yDrawings?.set(drawing.id, drawing)
})

// 描画削除
export const removeDrawingAtom = atom(null, (get, set, id: string) => {
  const yDrawings = get(yDrawingsAtom)
  yDrawings?.delete(id)
})

// 複数削除
export const removeDrawingsAtom = atom(null, (get, set, ids: string[]) => {
  const yDrawings = get(yDrawingsAtom)
  ids.forEach((id) => yDrawings?.delete(id))
})

// Y.Mapの変更を監視するためのカウンターatom
// Y.Mapが変更されるたびにこのatomをインクリメントして、再評価をトリガーする
const yDrawingsUpdateAtom = atom(0)

// 全描画オブジェクト取得（Y.Mapの変更を監視）
export const drawingsAtom = atom<Drawing[]>((get) => {
  const yDrawings = get(yDrawingsAtom)
  // 更新カウンターを監視して再評価をトリガー
  get(yDrawingsUpdateAtom)
  if (!yDrawings) return []
  return Array.from(yDrawings.values())
})
