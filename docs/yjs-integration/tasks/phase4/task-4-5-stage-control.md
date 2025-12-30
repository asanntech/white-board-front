# Task 4-5: useStageControlのYjs対応

## 概要

オブジェクトの変形操作をYjs対応に変更する

## 対象ファイル

- `src/lib/konva/hooks/useStageControl.ts`

## 依存タスク

- Task 3-4: 描画更新操作のYjs対応

## 実装内容

### 変更箇所

```typescript
// Before
import { pushToHistoryAtom } from '../atoms/drawingHistoryAtom'

const pushToHistory = useSetAtom(pushToHistoryAtom)

// 変形終了時
const pushTransformToHistory = useCallback(() => {
  const updatedNodes = transformerRef.current?.nodes().map(node => {
    return new Konva.Line({ ...node.attrs })
  })
  if (updatedNodes) {
    pushToHistory(updatedNodes)  // 旧API
    emitTransform(...)  // サーバーに送信
  }
}, [...])
```

```typescript
// After
import { updateDrawingAtom } from '../atoms/drawingHistoryAtom'
import { Drawing } from '../types'

const updateDrawing = useSetAtom(updateDrawingAtom)

// 変形終了時
const pushTransformToHistory = useCallback(() => {
  const nodes = transformerRef.current?.nodes()
  if (!nodes || nodes.length === 0) return
  
  const updatedDrawings: Drawing[] = nodes.map(node => ({
    ...node.attrs,
    x: node.x(),
    y: node.y(),
    scaleX: node.scaleX(),
    scaleY: node.scaleY(),
    rotation: node.rotation(),
  } as Drawing))
  
  updateDrawing(updatedDrawings)  // 新API（自動同期）
}, [...])
```

### 注意点

- `emitTransform`の呼び出しを削除（Yjsで自動同期）
- Konva.Nodeの現在の値（x(), y()等）を取得してDrawingに変換

## 完了条件

- [ ] `pushToHistoryAtom`のインポートが`updateDrawingAtom`に変更されている
- [ ] `pushToHistory`の呼び出しが`updateDrawing`に変更されている
- [ ] `emitTransform`の呼び出しが削除されている
- [ ] 変形操作がY.Mapに反映される

