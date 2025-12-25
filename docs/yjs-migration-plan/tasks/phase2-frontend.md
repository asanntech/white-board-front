# フェーズ 2: フロントエンド移行

**見積もり**: 2-3 日

## 概要

既存の`socketAtom.ts`と`drawingHistoryAtom.ts`を Yjs API に置き換えます。

---

## 2.1 Yjs Atom の実装

`src/lib/konva/atoms/socketAtom.ts`を置き換える新しい atom:

### 実装ファイル

`src/lib/yjs/yjsAtom.ts`

```typescript
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
    trackedOrigins: new Set([wsProvider]),
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
})
```

---

## 2.2 Undo/Redo 実装

`src/lib/konva/atoms/drawingHistoryAtom.ts`の 200 行の履歴管理を`Y.UndoManager`に置き換え:

```typescript
// Undo/Redoが数行で実装可能に
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
```

### コード量の比較

| 項目                  | 現在      | 移行後   |
| --------------------- | --------- | -------- |
| 履歴管理（undo/redo） | 約 200 行 | 約 20 行 |

---

## 2.3 描画操作の Yjs API 対応

```typescript
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

// 全描画オブジェクト取得（Y.Mapの変更を監視）
export const drawingsAtom = atom<Drawing[]>((get) => {
  const yDrawings = get(yDrawingsAtom)
  if (!yDrawings) return []
  return Array.from(yDrawings.values())
})
```

---

## 2.4 描画フック更新

### 更新対象ファイル

| ファイル                                      | 変更内容                      |
| --------------------------------------------- | ----------------------------- |
| `src/lib/konva/hooks/useDrawing.ts`           | Yjs atom を使用するように変更 |
| `src/lib/konva/hooks/useSocketManager.ts`     | Yjs 接続管理に変更            |
| `src/lib/konva/components/SocketProvider.tsx` | Yjs プロバイダーに変更        |

### useDrawing.ts の変更例

```typescript
// Before: pushToHistoryAtom, removeLineAtom を使用
// After: addDrawingAtom, removeDrawingAtom を使用

import { useAtom } from 'jotai'
import { addDrawingAtom, updateDrawingAtom, removeDrawingAtom, drawingsAtom } from '@/lib/yjs'

export const useDrawing = () => {
  const [drawings] = useAtom(drawingsAtom)
  const [, addDrawing] = useAtom(addDrawingAtom)
  const [, updateDrawing] = useAtom(updateDrawingAtom)
  const [, removeDrawing] = useAtom(removeDrawingAtom)

  // ...
}
```

---

## 完了条件

- [ ] `src/lib/yjs/yjsAtom.ts`が実装されている
- [ ] Undo/Redo 機能が`Y.UndoManager`で動作する
- [ ] 描画操作（追加、更新、削除）が Yjs API 経由で動作する
- [ ] `useDrawing.ts`が Yjs atom を使用している
- [ ] `useSocketManager.ts`が Yjs 接続管理に変更されている
