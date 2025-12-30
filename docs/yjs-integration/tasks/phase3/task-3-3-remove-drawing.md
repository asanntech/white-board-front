# Task 3-3: 描画削除操作のYjs対応

## 概要

描画削除時にY.Mapから削除するAtomを作成する

## 対象ファイル

- `src/lib/konva/atoms/drawingHistoryAtom.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `drawingHistoryAtom.ts`に追加

```typescript
// 描画を削除するAtom
export const removeDrawingAtom = atom(
  null,
  (get, set, ids: string | string[]) => {
    const yDrawings = get(yDrawingsAtom)
    const yDoc = get(yDocAtom)
    const idsArray = Array.isArray(ids) ? ids : [ids]
    
    yDoc.transact(() => {
      idsArray.forEach(id => {
        yDrawings.delete(id)
      })
    }, 'local')
    
    set(yMapVersionAtom, (v) => v + 1)
  }
)
```

### 設計ポイント

1. **単一/複数対応**: 単一のIDまたは配列を受け付ける
2. **transact**: 複数削除を1つのトランザクションにまとめる
3. **origin: 'local'**: UndoManagerの対象にする

### 旧APIとの対応

| 旧API | 新API |
|-------|-------|
| `removeLineAtom` | `removeDrawingAtom` |

## 完了条件

- [ ] `removeDrawingAtom`がエクスポートされている
- [ ] 単一のIDで削除できる
- [ ] 複数のIDで一括削除できる
- [ ] `'local'` originが設定されている

