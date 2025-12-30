# Task 5-2: Componentsエクスポートの更新

## 概要

YjsProviderをindex.tsからエクスポートする

## 対象ファイル

- `src/lib/konva/components/index.ts`

## 依存タスク

- Task 5-1: YjsProviderコンポーネントの作成

## 実装内容

### 変更前

```typescript
export { GraphPaperLayer } from './GraphPaperLayer'
export { SocketProvider } from './SocketProvider'
export { Toolbar } from './Toolbar'
```

### 変更後

```typescript
export { GraphPaperLayer } from './GraphPaperLayer'
export { SocketProvider } from './SocketProvider'
export { Toolbar } from './Toolbar'
export { YjsProvider } from './YjsProvider'  // 追加
```

## 完了条件

- [ ] `YjsProvider`がindex.tsからエクスポートされている
- [ ] 他のファイルから`import { YjsProvider } from '../components'`でインポートできる

