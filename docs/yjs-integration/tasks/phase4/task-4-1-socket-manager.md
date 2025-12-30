# Task 4-1: useSocketManagerのリファクタリング

## 概要

Yjsで自動同期されるため、不要になったemit関数を削除する

## 対象ファイル

- `src/lib/konva/hooks/useSocketManager.ts`

## 依存タスク

- Task 2-4: 旧イベントの削除

## 実装内容

### 削除するemit関数

```typescript
// 削除対象
const emitDrawing = useCallback(...)
const emitDrawingEnd = useCallback(...)
const emitTransform = useCallback(...)
const emitRemove = useCallback(...)
const emitUndo = useCallback(...)
const emitRedo = useCallback(...)
```

### 変更後

```typescript
import { useCallback } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import {
  socketAtom,
  roomIdAtom,
  socketConnectionAtom,
  socketErrorAtom,
  initializeSocketAtom,
  disconnectSocketAtom,
} from '../atoms/socketAtom'

// Socket接続を管理
export const useSocketManager = () => {
  const socket = useAtomValue(socketAtom)
  const roomId = useAtomValue(roomIdAtom)
  const isConnected = useAtomValue(socketConnectionAtom)
  const error = useAtomValue(socketErrorAtom)
  const initializeSocket = useSetAtom(initializeSocketAtom)
  const disconnectSocket = useSetAtom(disconnectSocketAtom)

  return {
    socket,
    roomId,
    isConnected,
    error,
    initializeSocket,
    disconnectSocket,
  }
}
```

### 設計ポイント

1. **emit不要**: Yjsのupdate eventが自動的にSocket.io経由で送信される
2. **接続管理のみ**: Socket接続の開始/終了のみを管理
3. **シンプル化**: 84行 → 約30行に削減

## 完了条件

- [ ] `emitDrawing`が削除されている
- [ ] `emitDrawingEnd`が削除されている
- [ ] `emitTransform`が削除されている
- [ ] `emitRemove`が削除されている
- [ ] `emitUndo`が削除されている
- [ ] `emitRedo`が削除されている
- [ ] 接続管理機能（initializeSocket, disconnectSocket）は維持されている

