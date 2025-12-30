# Task 6-1: Socket.ioイベント型の更新

## 概要

Socket.ioのイベント型をYjs対応に更新する

## 対象ファイル

- `src/lib/konva/atoms/socketAtom.ts`

## 依存タスク

- Task 2-1: Yjs update送信機能の追加
- Task 2-2: Yjs update受信機能の追加

## 実装内容

### 変更前

```typescript
type ServerToClientEvents = {
  drawing: (drawings: Drawing[]) => void
  drawingEnd: (drawing: Drawing) => void
  transform: (transforms: Drawing[]) => void
  remove: (drawings: Drawing[]) => void
  undoDrawings: (undoResult: UndoRedoResult) => void
  redoDrawings: (redoResult: UndoRedoResult) => void
  roomData: (drawings: Drawing[]) => void
  userEntered: (userId: string) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  drawing: (params: { roomId: string; drawings: Drawing[] }) => void
  drawingEnd: (params: { roomId: string; drawing: Drawing }) => void
  transform: (params: { roomId: string; drawings: Drawing[] }) => void
  remove: (params: { roomId: string; drawings: Drawing[] }) => void
  undo: (params: { roomId: string; undoResult: UndoRedoResult }) => void
  redo: (params: { roomId: string; redoResult: UndoRedoResult }) => void
}
```

### 変更後

```typescript
type ServerToClientEvents = {
  'yjs:update': (data: { update: number[] }) => void
  'yjs:sync': (data: { state: number[] }) => void
  userEntered: (userId: string) => void
}

export type ClientToServerEvents = {
  join: (params: { roomId: string }) => void
  'yjs:update': (params: { roomId: string; update: number[] }) => void
  'yjs:sync:request': (params: { roomId: string }) => void
}
```

### イベント対応表

| 旧イベント | 新イベント |
|-----------|-----------|
| drawing, drawingEnd, transform, remove | `yjs:update` |
| roomData | `yjs:sync` |
| undo, redo | （削除：ローカル処理のみ） |
| join | join（変更なし） |
| userEntered | userEntered（変更なし） |

## 完了条件

- [ ] `ServerToClientEvents`がYjs対応に更新されている
- [ ] `ClientToServerEvents`がYjs対応に更新されている
- [ ] 旧イベント型が削除されている
- [ ] 型エラーがないこと

