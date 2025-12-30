# Task 3-4: 描画更新操作のYjs対応

## 概要

描画更新（transform等）時にY.Mapを更新するAtomを作成する

## 対象ファイル

- `src/lib/konva/atoms/drawingHistoryAtom.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `drawingHistoryAtom.ts`に追加

```typescript
// 描画を更新するAtom
export const updateDrawingAtom = atom(
  null,
  (get, set, drawings: Drawing | Drawing[]) => {
    const yDrawings = get(yDrawingsAtom)
    const yDoc = get(yDocAtom)
    const drawingsArray = Array.isArray(drawings) ? drawings : [drawings]
    
    yDoc.transact(() => {
      drawingsArray.forEach(drawing => {
        // 既存のエントリを上書き
        yDrawings.set(drawing.id, drawing)
      })
    }, 'local')
    
    set(yMapVersionAtom, (v) => v + 1)
  }
)
```

### 使用例

```typescript
// Transformerで変形後に更新
const handleTransformEnd = () => {
  const updatedDrawings = selectedNodes.map(node => ({
    ...node.attrs,
    x: node.x(),
    y: node.y(),
    scaleX: node.scaleX(),
    scaleY: node.scaleY(),
    rotation: node.rotation(),
  }))
  
  updateDrawing(updatedDrawings)
}
```

### 旧APIとの対応

| 旧API | 新API |
|-------|-------|
| `updateLineAtom` | `updateDrawingAtom` |
| `pushToHistoryAtom`（transform時） | `updateDrawingAtom` |

## 完了条件

- [ ] `updateDrawingAtom`がエクスポートされている
- [ ] 単一/複数のDrawingを更新できる
- [ ] 位置、スケール、回転などのプロパティが更新される
- [ ] `'local'` originが設定されている

