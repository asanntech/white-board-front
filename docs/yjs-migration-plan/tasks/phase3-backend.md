# フェーズ 3: バックエンド変更

**見積もり**: 1-2 日

## 概要

既存の Socket.IO サーバーを y-websocket サーバーに置き換え、DynamoDB への JSON 形式での永続化を実装します。

---

## 3.1 y-websocket サーバーのセットアップ

既存の Socket.IO サーバーを y-websocket サーバーに置き換え:

```javascript
// server.js (Node.js)
const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')
const Y = require('yjs')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws, req) => {
  // 認証チェック（既存の認証フローを維持）
  const token = new URL(req.url, 'http://localhost').searchParams.get('token')
  if (!validateToken(token)) {
    ws.close()
    return
  }

  setupWSConnection(ws, req, {
    // カスタム永続化コールバック
    persistence: dynamoDBPersistence,
  })
})

server.listen(process.env.PORT || 1234)
```

### 環境変数

```bash
# フロントエンド
NEXT_PUBLIC_YJS_WS_URL=wss://your-yjs-server.example.com
```

---

## 3.2 DynamoDB 永続化アダプター（JSON 形式）

```javascript
// dynamodb-persistence.js
const { DynamoDBClient, GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION })

const dynamoDBPersistence = {
  // ルーム参加時：DynamoDBからJSONを読み込み、Y.Docに反映
  bindState: async (docName, ydoc) => {
    const yDrawings = ydoc.getMap('drawings')

    try {
      // 既存形式のJSONを取得
      const result = await dynamoDB.send(
        new GetItemCommand({
          TableName: 'rooms',
          Key: marshall({ roomId: docName }),
        })
      )

      if (result.Item) {
        const roomData = unmarshall(result.Item)
        if (roomData.drawings) {
          // JSONからY.Mapに変換
          Object.entries(roomData.drawings).forEach(([id, drawing]) => {
            yDrawings.set(id, drawing)
          })
        }
      }
    } catch (error) {
      console.error('Failed to load room data:', error)
    }
  },

  // 定期的またはルーム終了時：Y.DocをJSONとしてDynamoDBに保存
  writeState: async (docName, ydoc) => {
    const yDrawings = ydoc.getMap('drawings')

    try {
      // Y.MapをJSON形式に変換（既存形式を維持）
      const drawings = yDrawings.toJSON()

      await dynamoDB.send(
        new PutItemCommand({
          TableName: 'rooms',
          Item: marshall({
            roomId: docName,
            drawings: drawings, // { id1: Drawing, id2: Drawing, ... }
            updatedAt: Date.now(),
          }),
        })
      )
    } catch (error) {
      console.error('Failed to save room data:', error)
    }
  },
}

module.exports = { dynamoDBPersistence }
```

### DynamoDB スキーマ（既存形式を維持）

```
{
  "roomId": "string (PK)",
  "drawings": {
    "id1": { Drawing object },
    "id2": { Drawing object },
    ...
  },
  "updatedAt": "number"
}
```

---

## 3.3 認証の統合

y-websocket は接続時にクエリパラメータで認証可能。既存の認証フローを維持。

### フロントエンド側

```typescript
const wsProvider = new WebsocketProvider(
  process.env.NEXT_PUBLIC_YJS_WS_URL!,
  roomId,
  ydoc,
  { params: { token } } // クエリパラメータでトークンを送信
)
```

### バックエンド側

```javascript
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost')
  const token = url.searchParams.get('token')

  // 既存の認証ロジックを使用
  if (!validateToken(token)) {
    ws.close(4001, 'Unauthorized')
    return
  }

  // 認証成功後、Yjs接続をセットアップ
  setupWSConnection(ws, req, { persistence: dynamoDBPersistence })
})
```

---

## 3.4 データ移行

**移行スクリプトは不要**: JSON 形式を維持するため、既存の DynamoDB データはそのまま使用可能。

- `bindState`で既存形式を読み込み
- `writeState`で同じ形式で保存

### 既存データとの互換性

| 項目                        | 対応                 |
| --------------------------- | -------------------- |
| 既存の Drawing オブジェクト | そのまま読み込み可能 |
| roomId によるルーム管理     | そのまま使用可能     |
| データ形式                  | JSON 形式を維持      |

---

## 完了条件

- [ ] y-websocket サーバーが稼働している
- [ ] DynamoDB 永続化アダプターが実装されている
- [ ] 認証フローが既存と同様に動作する
- [ ] 既存の DynamoDB データが正しく読み込まれる
- [ ] 新しい描画データが JSON 形式で保存される
