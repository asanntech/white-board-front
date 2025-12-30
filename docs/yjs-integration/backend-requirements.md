# バックエンド実装要件: Yjs 対応

## 概要

フロントエンドで Yjs を導入し、リアルタイム同期処理を変更しました。
サーバーはリレーとして動作し、初期同期時のみ Drawing[]から Yjs バイナリへ変換します。

## アーキテクチャ

```
[永続化層]
DynamoDB/S3: Drawing[]形式（既存維持）

[初期同期]
クライアント接続 → サーバーがDB/S3からDrawing[]取得 → Y.Doc構築 → バイナリで返す

[リアルタイム同期]
クライアントA → yjs:update（バイナリ）→ サーバー → 他クライアントにブロードキャスト（リレーのみ）
```

## Socket.io イベント仕様

### クライアント → サーバー

| イベント名         | ペイロード                             | 説明                             |
| ------------------ | -------------------------------------- | -------------------------------- |
| `yjs:update`       | `{ roomId: string, update: number[] }` | Yjs の差分更新データ             |
| `yjs:sync:request` | `{ roomId: string }`                   | ルーム参加 + 初期状態同期リクエスト |

### サーバー → クライアント

| イベント名    | ペイロード             | 説明                         |
| ------------- | ---------------------- | ---------------------------- |
| `yjs:update`  | `{ update: number[] }` | 他クライアントからの差分更新 |
| `yjs:sync`    | `{ state: number[] }`  | 初期状態同期レスポンス       |
| `userEntered` | `userId: string`       | ユーザー入室通知             |

## 削除されたイベント

以下のイベントは Yjs に置き換わり、フロントエンドで使用していません：

- `join`（`yjs:sync:request`に統合）
- `drawing`
- `drawingEnd`
- `transform`
- `remove`
- `undo`
- `redo`
- `roomData`

## 実装要件

### 1. `yjs:update` の処理（リレーのみ）

サーバーは Y.Doc を保持せず、update をブロードキャストするだけです。

```typescript
socket.on('yjs:update', ({ roomId, update }) => {
  // 送信元以外の同一ルームクライアントに転送
  socket.to(roomId).emit('yjs:update', { update })
})
```

### 2. `yjs:sync:request` / `yjs:sync` の処理

ルーム参加と初期状態同期を兼ねます。DB/S3 から Drawing[]を取得し、Y.Doc を一時的に構築してバイナリで返します。

```typescript
import * as Y from 'yjs'

socket.on('yjs:sync:request', async ({ roomId }) => {
  // 0. ルームに参加
  socket.join(roomId)

  // 1. DB/S3からDrawing[]を取得（既存実装を流用）
  const drawings: Drawing[] = await getDrawingsFromDB(roomId)

  // 2. 一時的にY.Docを構築
  const yDoc = new Y.Doc()
  const yDrawings = yDoc.getMap<Drawing>('drawings')

  // 3. Drawing[]をY.Mapに投入
  yDoc.transact(() => {
    drawings.forEach((drawing) => {
      yDrawings.set(drawing.id, drawing)
    })
  })

  // 4. バイナリにエンコードして返す
  const state = Y.encodeStateAsUpdate(yDoc)
  socket.emit('yjs:sync', { state: Array.from(state) })

  // 5. Y.Docは破棄（メモリ解放）
  yDoc.destroy()
})
```

## 必要パッケージ

```bash
pnpm add yjs
```

## Drawing 型定義

```typescript
type Drawing = {
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
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'round' | 'bevel' | 'miter'
  opacity?: number
}
```

## 補足

- `update`/`state`は`Uint8Array`のバイナリデータを`number[]`に変換して送受信
- サーバーは Y.Doc を常時保持しない（初期同期時のみ一時的に構築）
- Yjs が競合解消（CRDT）を自動処理するため、サーバー側でのマージ処理は不要
- 既存の DB/S3 データ構造（Drawing[]）は変更不要
