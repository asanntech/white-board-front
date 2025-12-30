# Task 4-4: useSelectionRangeのYjs対応

## 概要

選択範囲の削除操作をYjs対応に変更する

## 対象ファイル

- `src/lib/konva/hooks/useSelectionRange.ts`

## 依存タスク

- Task 3-3: 描画削除操作のYjs対応

## 実装内容

### 変更箇所

```typescript
// Before
import { removeLineAtom } from '../atoms/drawingHistoryAtom'

const removeLine = useSetAtom(removeLineAtom)

// 選択オブジェクトの削除
const deleteSelected = useCallback(() => {
  const ids = selectedNodes.map(node => node.id())
  removeLine(ids)  // 旧API
  emitRemove(...)  // サーバーに送信
}, [...])
```

```typescript
// After
import { removeDrawingAtom } from '../atoms/drawingHistoryAtom'

const removeDrawing = useSetAtom(removeDrawingAtom)

// 選択オブジェクトの削除
const deleteSelected = useCallback(() => {
  const ids = selectedNodes.map(node => node.id())
  removeDrawing(ids)  // 新API（自動同期）
}, [...])
```

### 注意点

- `emitRemove`の呼び出しを削除（Yjsで自動同期）
- useSocketManagerからのemitRemoveの参照も削除

## 完了条件

- [ ] `removeLineAtom`のインポートが`removeDrawingAtom`に変更されている
- [ ] `removeLine`の呼び出しが`removeDrawing`に変更されている
- [ ] `emitRemove`の呼び出しが削除されている
- [ ] 選択範囲の削除がY.Mapに反映される

