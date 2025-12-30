# Task 2-4: 旧イベントの削除

## 概要

Yjsに置き換えられた旧来の同期イベントを削除する

## 対象ファイル

- `src/lib/konva/atoms/socketAtom.ts`

## 依存タスク

- Task 2-3: 初期状態同期の実装

## 実装内容

### 削除するイベントリスナー

以下のイベントリスナーを`initializeSocketAtom`から削除:

```typescript
// 削除対象
newSocket.on('roomData', (drawings: Drawing[]) => { ... })
newSocket.on('drawing', (drawings: Drawing[]) => { ... })
newSocket.on('drawingEnd', (drawing: Drawing) => { ... })
newSocket.on('transform', (transforms: Drawing[]) => { ... })
newSocket.on('remove', (drawings: Drawing[]) => { ... })
newSocket.on('undoDrawings', (undoResult: UndoRedoResult) => { ... })
newSocket.on('redoDrawings', (redoResult: UndoRedoResult) => { ... })
```

### 削除するインポート

```typescript
// 削除対象
import { initHistoryAtom, pushToHistoryAtom, removeLineAtom, updateLineAtom } from './drawingHistoryAtom'
import { Drawing, UndoRedoResult } from '../types'
```

### 変更後の構成

```typescript
import { atom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import * as Y from 'yjs'
import { yDoc } from './yjsAtom'

// ... Yjs関連のイベントのみ残す
```

## 完了条件

- [ ] `roomData`イベントリスナーが削除されている
- [ ] `drawing`イベントリスナーが削除されている
- [ ] `drawingEnd`イベントリスナーが削除されている
- [ ] `transform`イベントリスナーが削除されている
- [ ] `remove`イベントリスナーが削除されている
- [ ] `undoDrawings`イベントリスナーが削除されている
- [ ] `redoDrawings`イベントリスナーが削除されている
- [ ] 不要なインポートが削除されている

