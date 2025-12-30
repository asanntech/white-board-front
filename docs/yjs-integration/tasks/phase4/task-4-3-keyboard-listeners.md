# Task 4-3: useKeyboardListenersのYjs対応

## 概要

undo/redo操作をYjsのUndoManagerに変更する

## 対象ファイル

- `src/lib/konva/hooks/useKeyboardListeners.ts`

## 依存タスク

- Task 1-3: UndoManager Atomの作成

## 実装内容

### 変更箇所

```typescript
// Before
import { undoAtom, redoAtom } from '../atoms/drawingHistoryAtom'

// After
import { undoAtom, redoAtom } from '../atoms/yjsAtom'
```

### 確認が必要な箇所

現在の`useKeyboardListeners.ts`の実装を確認し、以下を変更:

1. インポート元の変更（drawingHistoryAtom → yjsAtom）
2. 戻り値の処理があれば削除（Yjs版は戻り値なし）

```typescript
// 変更前（戻り値あり）
const handleUndo = useCallback(() => {
  const result = undo()  // UndoRedoResultを返す
  if (result) {
    emitUndo(result)  // サーバーに送信
  }
}, [undo, emitUndo])

// 変更後（シンプル）
const handleUndo = useCallback(() => {
  undo()  // YjsのUndoManagerが自動で同期
}, [undo])
```

## 完了条件

- [ ] `undoAtom`のインポートが`yjsAtom`からになっている
- [ ] `redoAtom`のインポートが`yjsAtom`からになっている
- [ ] サーバーへの送信処理（emitUndo, emitRedo）が削除されている
- [ ] Ctrl+Z でYjsのundoが動作する
- [ ] Ctrl+Shift+Z でYjsのredoが動作する

