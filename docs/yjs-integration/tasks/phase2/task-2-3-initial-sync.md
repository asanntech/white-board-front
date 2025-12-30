# Task 2-3: 初期状態同期の実装

## 概要

ルーム入室時に既存の描画データをY.Docに同期する

## 対象ファイル

- `src/lib/konva/atoms/socketAtom.ts`

## 依存タスク

- Task 2-1: Yjs update送信機能の追加
- Task 2-2: Yjs update受信機能の追加

## 実装内容

### `socketAtom.ts`に追加

```typescript
import * as Y from 'yjs'
import { encodeStateAsUpdate } from 'y-protocols/sync'
import { yDoc } from './yjsAtom'

// initializeSocketAtom内に追加

// サーバーから初期状態を受信
newSocket.on('yjs:sync', (data: { state: number[] }) => {
  const state = new Uint8Array(data.state)
  Y.applyUpdate(yDoc, state, 'remote')
})

// 接続成功後に同期を要求
newSocket.on('connect', () => {
  set(socketConnectionAtom, true)
  set(socketErrorAtom, null)
  set(roomIdAtom, roomId)
  
  // ルームに参加
  newSocket.emit('join', { roomId })
  
  // 初期状態の同期を要求
  newSocket.emit('yjs:sync:request', { roomId })
})
```

### サーバー側の期待動作

サーバーは`yjs:sync:request`を受信したら:
1. ルームのY.Docの状態を`Y.encodeStateAsUpdate(yDoc)`で取得
2. `yjs:sync`イベントで状態を返送

### 設計ポイント

1. **入室時に同期**: `join`の後に`yjs:sync:request`を送信
2. **フルステート同期**: 差分ではなくフルステートを受信して適用
3. **既存のroomData置き換え**: 旧来の`roomData`イベントを置き換え

## 完了条件

- [ ] `yjs:sync`イベントのリスナーが追加されている
- [ ] `yjs:sync:request`イベントが送信されている
- [ ] 入室時に既存の描画データが同期される

