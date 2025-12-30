# Task 1-4: Atomエクスポートの更新

## 概要

新規作成したyjsAtomをindex.tsからエクスポートする

## 対象ファイル

- `src/lib/konva/atoms/index.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成
- Task 1-3: UndoManager Atomの作成

## 実装内容

### 変更前

```typescript
export * from './drawingHistoryAtom'
export * from './canvasAtom'
export * from './toolAtom'
export * from './keyboardAtom'
export * from './socketAtom'
```

### 変更後

```typescript
export * from './drawingHistoryAtom'
export * from './canvasAtom'
export * from './toolAtom'
export * from './keyboardAtom'
export * from './socketAtom'
export * from './yjsAtom'  // 追加
```

## 完了条件

- [ ] `yjsAtom`がindex.tsからエクスポートされている
- [ ] 他のファイルから`import { yDocAtom, yDrawingsAtom, undoAtom, redoAtom, canUndoAtom, canRedoAtom } from '../atoms'`でインポートできる

