# Task 5-1: YjsProviderコンポーネントの作成

## 概要

Y.Mapの変更監視を設定するProviderコンポーネントを作成する

## 対象ファイル

- `src/lib/konva/components/YjsProvider.tsx`（新規作成）

## 依存タスク

- Task 3-1: Y.Map監視による状態更新Atomの作成

## 実装内容

### 新規作成: `YjsProvider.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import * as Y from 'yjs'
import { yDrawingsAtom } from '../atoms/yjsAtom'
import { yMapVersionAtom } from '../atoms/drawingHistoryAtom'
import { Drawing } from '../types'

export const YjsProvider = ({ children }: { children: React.ReactNode }) => {
  const yDrawings = useAtomValue(yDrawingsAtom)
  const setYMapVersion = useSetAtom(yMapVersionAtom)

  useEffect(() => {
    // Y.Mapの変更を監視
    const observer = (event: Y.YMapEvent<Drawing>) => {
      // 変更があったらバージョンを更新してUIを再レンダリング
      setYMapVersion((v) => v + 1)
    }

    yDrawings.observe(observer)

    return () => {
      yDrawings.unobserve(observer)
    }
  }, [yDrawings, setYMapVersion])

  return <>{children}</>
}
```

### 使用方法

`SocketProvider`と組み合わせて使用:

```typescript
// room/[id]/page.tsx
<SocketProvider roomId={roomId}>
  <YjsProvider>
    <WhiteBoard />
  </YjsProvider>
</SocketProvider>
```

### 設計ポイント

1. **observeパターン**: Y.Mapの変更を監視してJotaiの状態を更新
2. **バージョンカウンター**: 変更を検知するためのトリガー
3. **クリーンアップ**: アンマウント時にobserverを解除

## 完了条件

- [ ] `YjsProvider.tsx`が作成されている
- [ ] Y.Mapの変更が監視されている
- [ ] 変更時にyMapVersionAtomが更新される
- [ ] 他クライアントからの変更がUIに反映される

