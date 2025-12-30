# Task 2-1: Yjs update送信機能の追加

## 概要

Y.Docの変更をSocket.io経由で他クライアントに送信する

## 対象ファイル

- `src/lib/konva/atoms/socketAtom.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `socketAtom.ts`に追加

`initializeSocketAtom`内で、Y.Docのupdateイベントを監視して送信:

```typescript
import * as Y from 'yjs'
import { yDoc } from './yjsAtom'

// initializeSocketAtom内に追加
export const initializeSocketAtom = atom(null, (get, set, roomId: string, token: string) => {
  // ... 既存のSocket初期化コード ...

  // Y.Docの変更を監視して送信
  const handleUpdate = (update: Uint8Array, origin: unknown) => {
    // ローカルの変更のみ送信（リモートからの変更は送信しない）
    if (origin === 'local') {
      newSocket.emit('yjs:update', { 
        roomId, 
        update: Array.from(update)  // Uint8Arrayを配列に変換
      })
    }
  }

  yDoc.on('update', handleUpdate)

  // クリーンアップ時にリスナーを解除
  // disconnectSocketAtom内で yDoc.off('update', handleUpdate) を呼ぶ
})
```

### 設計ポイント

1. **origin === 'local'**: ローカルの変更のみ送信し、リモートからの変更は再送信しない
2. **Uint8Array → Array**: Socket.ioでバイナリを送信するために配列に変換
3. **roomId**: 送信先のルームを指定

## 完了条件

- [ ] Y.Docのupdateイベントが監視されている
- [ ] ローカルの変更のみがSocket.io経由で送信される
- [ ] updateデータがUint8Arrayから配列に正しく変換されている

