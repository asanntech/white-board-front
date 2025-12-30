# Task 3-2: 描画追加操作のYjs対応

## 概要

描画追加時にY.Mapに追加するAtomを作成する

## 対象ファイル

- `src/lib/konva/atoms/drawingHistoryAtom.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `drawingHistoryAtom.ts`に追加

```typescript
import { yDocAtom, yDrawingsAtom } from './yjsAtom'
import { Drawing } from '../types'

// 描画を追加するAtom
export const addDrawingAtom = atom(
  null,
  (get, set, drawing: Drawing) => {
    const yDrawings = get(yDrawingsAtom)
    const yDoc = get(yDocAtom)
    
    // トランザクション内で実行し、'local'をoriginに指定
    yDoc.transact(() => {
      yDrawings.set(drawing.id, drawing)
    }, 'local')
    
    // UIの更新をトリガー
    set(yMapVersionAtom, (v) => v + 1)
  }
)

// 複数の描画を一括追加するAtom
export const addDrawingsAtom = atom(
  null,
  (get, set, drawings: Drawing[]) => {
    const yDrawings = get(yDrawingsAtom)
    const yDoc = get(yDocAtom)
    
    yDoc.transact(() => {
      drawings.forEach(drawing => {
        yDrawings.set(drawing.id, drawing)
      })
    }, 'local')
    
    set(yMapVersionAtom, (v) => v + 1)
  }
)
```

### 設計ポイント

1. **transact**: トランザクション内で実行し、1つのupdateにまとめる
2. **origin: 'local'**: UndoManagerの対象にする
3. **バージョン更新**: UIの再レンダリングをトリガー

### 旧APIとの対応

| 旧API | 新API |
|-------|-------|
| `pushToHistoryAtom` | `addDrawingAtom` |

## 完了条件

- [ ] `addDrawingAtom`がエクスポートされている
- [ ] `addDrawingsAtom`がエクスポートされている
- [ ] 描画がY.Mapに追加される
- [ ] `'local'` originが設定されている

