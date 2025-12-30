# Task 4-2: useDrawingのYjs対応

## 概要

描画終了時のY.Mapへの追加処理に変更する

## 対象ファイル

- `src/lib/konva/hooks/useDrawing.ts`

## 依存タスク

- Task 3-2: 描画追加操作のYjs対応

## 実装内容

### 変更箇所

```typescript
// Before
import { lineNodesAtom, pushToHistoryAtom } from '../atoms'

const pushToHistory = useSetAtom(pushToHistoryAtom)

// 描画を終了する
const finishDrawing = useCallback(
  (isPushToHistory = true) => {
    // ...
    if (isPenMode && isPushToHistory) {
      pushToHistory(newLineNode)  // 旧API
    }
    // ...
  },
  [isPenMode, tempLineNode, pushToHistory]
)
```

```typescript
// After
import { lineNodesAtom, addDrawingAtom } from '../atoms'
import { Drawing } from '../types'

const addDrawing = useSetAtom(addDrawingAtom)

// 描画を終了する
const finishDrawing = useCallback(
  (isPushToHistory = true) => {
    // ...
    if (isPenMode && isPushToHistory) {
      // Konva.LineからDrawingに変換してY.Mapに追加
      const drawing: Drawing = newLineNode.attrs as Drawing
      addDrawing(drawing)  // 新API
    }
    // ...
  },
  [isPenMode, tempLineNode, addDrawing]
)
```

### 注意点

- `Konva.Line`の`attrs`を`Drawing`型として取得
- 描画終了後、Y.Mapへの追加と同時に他クライアントに自動同期

## 完了条件

- [ ] `pushToHistoryAtom`のインポートが`addDrawingAtom`に変更されている
- [ ] `pushToHistory`の呼び出しが`addDrawing`に変更されている
- [ ] 描画終了時にY.Mapに追加される

