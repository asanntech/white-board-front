# CLAUDE.md

このファイルはClaude Codeがプロジェクトを理解するためのガイドです。

## プロジェクト概要

複数ユーザーがリアルタイムで共同作業できるオンラインホワイトボードアプリケーションのフロントエンド。

- Socket通信によるリアルタイム描画同期
- Cognito + JWTによる認証基盤
- DynamoDB + S3によるクラウド永続化

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Next.js 15 (App Router, Turbopack)
- **状態管理**: Zustand
- **データフェッチ**: TanStack Query
- **描画ライブラリ**: Konva (react-konva)
- **リアルタイム通信**: Socket.IO
- **スタイリング**: Tailwind CSS v4
- **パッケージマネージャー**: pnpm

## 開発コマンド

```bash
pnpm install    # 依存関係インストール
pnpm dev        # 開発サーバー起動（Turbopack）
pnpm build      # プロダクションビルド
pnpm lint       # ESLint実行
pnpm generate-api  # OpenAPI からクライアント生成
```

## ディレクトリ構造

```
src/
├── app/                    # プレゼンテーション層：ページルーティング・レイアウト（Next.js App Router）
│   ├── api/                # API Routes (認証コールバック、トークン管理)
│   └── (auth)/             # 認証が必要なページ群
│       └── room/[id]/      # ホワイトボードルーム
├── stores/                 # グローバル状態（Zustand stores）
│   └── userStore.ts        # ユーザー状態（共有カーネル）
├── components/             # 共通UIコンポーネント
├── features/               # 境界づけられたコンテキスト（業務領域単位）
│   ├── auth/               # 認証ドメイン
│   │   ├── domain/         # ドメイン層（エンティティ、リポジトリIF）
│   │   ├── api/            # インフラ層（リポジトリ実装）
│   │   └── hooks/          # アプリケーション層（ユースケース）
│   ├── room/               # ルームドメイン
│   └── whiteboard/         # ホワイトボードドメイン（描画、協調編集）
│       ├── stores/         # 状態管理（ドメイン内にカプセル化）
│       ├── hooks/          # 描画ロジック、ズーム/パン、ソケット通信
│       └── components/     # プレゼンテーション層：ドメイン固有UI（ツールバー等）
├── hooks/                  # 共通ユーティリティフック（ドメイン非依存）
├── lib/
│   ├── open-api/           # OpenAPIクライアント（自動生成）
│   └── react-query/        # TanStack Query設定
└── shared/                 # 共有ユーティリティ、型、定数
```

## アーキテクチャ

**DDD + レイヤードアーキテクチャ**を採用。業務領域単位で最適なアーキテクチャを選定。

```
features/{domain}/
├── domain/     # ドメイン層（エンティティ、リポジトリIF）
├── api/        # インフラ層（リポジトリ実装）
├── hooks/      # アプリケーション層（ユースケース）
└── components/ # プレゼンテーション層：ドメイン固有UI（必要に応じて配置）
```

- 依存性逆転の原則（DIP）により、ドメイン層がインフラ層に依存しない構造
- ドメインの複雑度に応じて層の粒度を調整
- プレゼンテーション層は2箇所に分散配置：
  - `src/app/` - ページルーティング・レイアウト
  - `features/{domain}/components/` - ドメイン固有UI（凝集度重視）

### ホワイトボード機能 (`src/features/whiteboard`)

- stores/ 配下で状態管理（ドメイン内にカプセル化、直接UIから変更しない）
- hooks経由でビジネスロジックを実行
- componentsはロジックをhooksに委譲
- 外部公開はhooks経由（`useCanvasReady`等）、storesは直接公開しない

## コーディング規約

- UIコンポーネントはロジックをhooksに委譲する
- 状態変更はstores経由で行う（直接変更しない）
- エラーハンドリングはErrorBoundary（react-error-boundary）で一括管理
- 外部API連携はTanStack Queryを使用

## コミット規約

- 各タスク完了時にコミットを作成する
- コミット前にメッセージをユーザーに確認する
- コミットメッセージは端的に記述する

## テスト戦略

### ユニットテスト
- **フレームワーク**: Vitest + Testing Library
- **対象**: ドメイン層（エンティティ、値オブジェクト）、アプリケーション層（hooks）、stores
- **ファイル配置**: テスト対象と同階層に `*.test.ts(x)` を配置
- **コマンド**: `pnpm test`（実行）、`pnpm test:ui`（UIモード）

### E2Eテスト
- **フレームワーク**: Playwright
- **対象**: 認証フロー（ログイン/ログアウト、リダイレクト）、ホワイトボード操作（描画、undo/redo、ツール切り替え）
- **ファイル配置**: `src/e2e/*.spec.ts`
- **コマンド**: `pnpm e2e`（実行）、`pnpm e2e:ui`（UIモード）、`pnpm e2e:headed`（ブラウザ表示）
- **ホワイトボード検証**: スクリーンショット比較（`toHaveScreenshot()`）で描画結果を視覚的に検証。スナップショットはCI上で生成・管理。

## 認証

- Cognito + JWT認証
- トークンはHttpOnly Cookieで管理（XSS対策）
- Next.jsサーバーサイドでCookie操作
- アクセストークンは30日で期限切れ、自動リフレッシュ

## リアルタイム通信

- Socket.IOでサーバー（Nest.js）と接続
- 描画操作はローカル状態更新後、サーバーへ送信
- 他ユーザーからの描画データを受信して状態更新

## 関連リポジトリ

- バックエンド: https://github.com/asanntech/white-board-server
- インフラ: https://github.com/asanntech/white-board-infra
