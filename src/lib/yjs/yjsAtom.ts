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
    trackedOrigins: new Set([wsProvider]), // 他のユーザーからの変更を追跡しない
  })

  set(yDocAtom, ydoc)
  set(yDrawingsAtom, yDrawings)
  set(yUndoManagerAtom, undoManager)
  set(wsProviderAtom, wsProvider)
})

// 切断Atom
export const disconnectYjsAtom = atom(null, (get, set) => {
  const wsProvider = get(wsProviderAtom)
  if (wsProvider) {
    wsProvider.destroy()
  }
  set(yDocAtom, null)
  set(yDrawingsAtom, null)
  set(yUndoManagerAtom, null)
  set(wsProviderAtom, null)
  set(yjsConnectionAtom, false)
  set(yjsErrorAtom, null)
})
