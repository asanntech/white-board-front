# フェーズ 1: 基盤準備

**見積もり**: 0.5-1 日

## 概要

Yjs 導入のための基盤を整備します。パッケージのインストール、ドキュメント構造の設計、新規ファイルの作成を行います。

---

## 1.1 パッケージインストール

```bash
pnpm add yjs y-websocket
```

### インストールするパッケージ

| パッケージ    | 説明                                  |
| ------------- | ------------------------------------- |
| `yjs`         | CRDT ベースの共有データ構造ライブラリ |
| `y-websocket` | Yjs の WebSocket プロバイダー         |

---

## 1.2 Yjs ドキュメント構造の設計

`Y.Map`で drawing オブジェクトを管理:

```typescript
// Y.Doc構造
const ydoc = new Y.Doc()
const yDrawings = ydoc.getMap<Drawing>('drawings') // key: drawing.id
```

### データ構造

```
Y.Doc
└── Y.Map<Drawing>('drawings')
    ├── [drawing.id]: Drawing
    ├── [drawing.id]: Drawing
    └── ...
```

### Drawing 型（既存）

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
  // ...
}
```

---

## 1.3 新規ファイル作成

### 作成するファイル

| ファイルパス             | 説明                                             |
| ------------------------ | ------------------------------------------------ |
| `src/lib/yjs/yjsAtom.ts` | Y.Doc、プロバイダー、UndoManager を管理する atom |
| `src/lib/yjs/types.ts`   | Yjs 関連の型定義                                 |
| `src/lib/yjs/index.ts`   | エクスポート用インデックス                       |

### ディレクトリ構造

```
src/lib/yjs/
├── index.ts
├── types.ts
└── yjsAtom.ts
```

---

## 完了条件

- [ ] `yjs`、`y-websocket`がインストールされている
- [ ] `src/lib/yjs/`ディレクトリが作成されている
- [ ] 基本的なファイル構造が準備されている
