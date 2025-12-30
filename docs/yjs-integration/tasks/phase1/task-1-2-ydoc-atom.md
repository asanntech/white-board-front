# Task 1-2: Y.Doc管理Atomの作成

## 概要

Y.DocインスタンスとY.Mapを管理するJotai Atomを作成する

## 対象ファイル

- `src/lib/konva/atoms/yjsAtom.ts`（新規作成）

## 依存タスク

- Task 1-1: パッケージインストール

## 実装内容

### 新規作成: `yjsAtom.ts`

```typescript
import * as Y from 'yjs'
import { atom } from 'jotai'
import { Drawing } from '../types'

// Y.Docインスタンス（シングルトン）
const yDoc = new Y.Doc()

// 描画データを管理するY.Map
// キー: drawing.id, 値: Drawing
export const yDrawings = yDoc.getMap<Drawing>('drawings')

// Y.Docを公開するAtom
export const yDocAtom = atom(yDoc)

// Y.Map（drawings）を公開するAtom
export const yDrawingsAtom = atom(yDrawings)
```

### 設計ポイント

1. **Y.Docはシングルトン**: アプリケーション全体で1つのY.Docを共有
2. **Y.Map<Drawing>**: 描画オブジェクトをIDでキーにしたMapで管理
3. **Atomで公開**: JotaiのAtomとして公開し、他のコンポーネントから参照可能に

## 完了条件

- [ ] `yjsAtom.ts`が作成されている
- [ ] Y.Docインスタンスが作成されている
- [ ] `yDrawings`（Y.Map<Drawing>）が定義されている
- [ ] `yDocAtom`がエクスポートされている
- [ ] `yDrawingsAtom`がエクスポートされている

