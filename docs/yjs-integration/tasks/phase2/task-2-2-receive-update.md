# Task 2-2: Yjs update受信機能の追加

## 概要

他クライアントからのYjs updateを受信してY.Docに適用する

## 対象ファイル

- `src/lib/konva/atoms/socketAtom.ts`

## 依存タスク

- Task 1-2: Y.Doc管理Atomの作成

## 実装内容

### `socketAtom.ts`に追加

`initializeSocketAtom`内でイベントリスナーを追加:

```typescript
import * as Y from 'yjs'
import { yDoc } from './yjsAtom'

// initializeSocketAtom内に追加
newSocket.on('yjs:update', (data: { update: number[] }) => {
  // 配列をUint8Arrayに変換
  const update = new Uint8Array(data.update)
  
  // Y.Docに適用（'remote'を指定してリモートからの変更であることを明示）
  Y.applyUpdate(yDoc, update, 'remote')
})
```

### 設計ポイント

1. **Array → Uint8Array**: Socket.ioから受信した配列をUint8Arrayに変換
2. **origin: 'remote'**: リモートからの変更であることを明示し、UndoManagerの対象外にする
3. **自動マージ**: YjsのCRDTが競合を自動解消

## 完了条件

- [ ] `yjs:update`イベントのリスナーが追加されている
- [ ] 受信したupdateがUint8Arrayに正しく変換されている
- [ ] Y.Docに`'remote'` originで適用されている

