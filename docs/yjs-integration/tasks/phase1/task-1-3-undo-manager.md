# Task 1-3: UndoManager Atomの作成

## 概要

YjsのUndoManagerを使用したundo/redo機能を実装する

## 対象ファイル

- `src/lib/konva/atoms/yjsAtom.ts`（追記）

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `yjsAtom.ts`に追記

```typescript
import { UndoManager } from 'yjs'

// UndoManager（ローカル操作のみ対象）
// trackedOriginsに'local'を指定することで、自分の操作のみundo/redo対象にする
const undoManager = new UndoManager(yDrawings, {
  trackedOrigins: new Set(['local']),
})

// UndoManagerを公開するAtom
export const undoManagerAtom = atom(undoManager)

// Undo操作
export const undoAtom = atom(null, (get) => {
  const um = get(undoManagerAtom)
  um.undo()
})

// Redo操作
export const redoAtom = atom(null, (get) => {
  const um = get(undoManagerAtom)
  um.redo()
})

// Undo可能かどうか
export const canUndoAtom = atom((get) => {
  const um = get(undoManagerAtom)
  return um.undoStack.length > 0
})

// Redo可能かどうか
export const canRedoAtom = atom((get) => {
  const um = get(undoManagerAtom)
  return um.redoStack.length > 0
})
```

### 設計ポイント

1. **trackedOrigins**: `'local'`を指定することで、自分の操作のみをundo/redo対象にする
2. **他ユーザーの変更**: `'remote'`originの変更はundo/redo対象外
3. **既存のundo/redoとの互換性**: 同じインターフェース（`undoAtom`, `redoAtom`, `canUndoAtom`, `canRedoAtom`）を維持

### 注意点

- `canUndoAtom`と`canRedoAtom`はYjsのスタックを直接参照しているため、リアクティブに更新されない可能性がある
- 必要に応じて、UndoManagerの`on('stack-item-added')`イベントを監視して状態を更新する実装を検討

## 完了条件

- [ ] UndoManagerが作成されている
- [ ] `trackedOrigins`に`'local'`が設定されている
- [ ] `undoAtom`がエクスポートされている
- [ ] `redoAtom`がエクスポートされている
- [ ] `canUndoAtom`がエクスポートされている
- [ ] `canRedoAtom`がエクスポートされている

