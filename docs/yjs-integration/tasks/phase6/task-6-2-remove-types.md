# Task 6-2: UndoRedoResult型の削除

## 概要

Yjsでは不要になったUndoRedoResult型を削除する

## 対象ファイル

- `src/lib/konva/types.ts`

## 依存タスク

- Task 3-1: Y.Map監視による状態更新Atomの作成

## 実装内容

### 変更前

```typescript
import { LineCap, LineJoin } from 'konva/lib/Shape'

export type Tool = 'select' | 'pen' | 'redPen' | 'marker' | 'eraser'

export type Drawing = {
  id: string
  type: string
  points: number[]
  stroke: string
  strokeWidth: number
  x?: number
  y?: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  lineCap?: LineCap
  lineJoin?: LineJoin
  opacity?: number
}

export type UndoRedoResult = {
  action: 'delete' | 'restore' | 'transform'
  objects: Drawing[]
}
```

### 変更後

```typescript
import { LineCap, LineJoin } from 'konva/lib/Shape'

export type Tool = 'select' | 'pen' | 'redPen' | 'marker' | 'eraser'

export type Drawing = {
  id: string
  type: string
  points: number[]
  stroke: string
  strokeWidth: number
  x?: number
  y?: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  lineCap?: LineCap
  lineJoin?: LineJoin
  opacity?: number
}

// UndoRedoResult型を削除
// Yjsでは不要（UndoManagerが内部で管理）
```

### 確認事項

削除前に以下を確認:
1. `UndoRedoResult`を参照している箇所がないこと
2. 削除後にTypeScriptエラーがないこと

```bash
# 参照箇所の確認
grep -r "UndoRedoResult" src/
```

## 完了条件

- [ ] `UndoRedoResult`型が削除されている
- [ ] 削除後にTypeScriptエラーがないこと
- [ ] `types.ts`のインポート/エクスポートにエラーがないこと

