# Task 3-1: Y.Map監視による状態更新Atomの作成

## 概要

Y.Mapの変更を監視してKonva.Lineの配列を更新するAtomを作成する

## 対象ファイル

- `src/lib/konva/atoms/drawingHistoryAtom.ts`（全面書き換え）

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### 変更前（200行）

```typescript
// 複雑な履歴管理ロジック
const historyAtom = atom<{
  past: Konva.Node[][]
  present: Konva.Node[]
  future: Konva.Node[][]
}>({ ... })

// 多数の履歴操作Atom
export const pushToHistoryAtom = ...
export const updateLineAtom = ...
export const removeLineAtom = ...
// など
```

### 変更後（約30行）

```typescript
import { atom } from 'jotai'
import Konva from 'konva'
import { yDrawingsAtom } from './yjsAtom'
import { Drawing } from '../types'

// Y.Mapの更新をトリガーするためのバージョンカウンター
export const yMapVersionAtom = atom(0)

// Y.Mapの内容をKonva.Lineの配列として公開
export const lineNodesAtom = atom<Konva.Line[]>((get) => {
  // バージョンを参照することで、更新時に再計算をトリガー
  get(yMapVersionAtom)
  
  const yDrawings = get(yDrawingsAtom)
  const lines: Konva.Line[] = []
  
  yDrawings.forEach((drawing, id) => {
    lines.push(new Konva.Line({ ...drawing, id }))
  })
  
  return lines
})
```

### 削除するコード

- `historyAtom`（past/present/future管理）
- `initHistoryAtom`
- `pushToHistoryAtom`
- `updateLineAtom`
- `removeLineAtom`
- `undoAtom`, `redoAtom`（yjsAtomに移動済み）
- `canUndoAtom`, `canRedoAtom`（yjsAtomに移動済み）
- `extractDeletedObjects`
- `extractRestoredObjects`
- `extractTransformedObjects`

### 設計ポイント

1. **シンプル化**: 200行 → 約30行に削減
2. **バージョンカウンター**: Y.Mapの変更をJotaiに通知するためのトリガー
3. **読み取り専用**: lineNodesAtomは読み取り専用で、書き込みは別のAtomで行う

## 完了条件

- [ ] 履歴管理ロジック（past/present/future）が削除されている
- [ ] `lineNodesAtom`がY.Mapから描画データを取得している
- [ ] `yMapVersionAtom`が作成されている
- [ ] 不要な関数（extract*）が削除されている

