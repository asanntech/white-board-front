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
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (認証コールバック、トークン管理)
│   └── (auth)/             # 認証が必要なページ群
│       └── room/[id]/      # ホワイトボードルーム
├── stores/                 # グローバル状態（Zustand stores）
│   ├── userStore.ts        # ユーザー状態
│   └── konva/              # ホワイトボード状態（スライスパターン）
├── components/             # 共通UIコンポーネント
├── features/               # ドメイン・インフラ層
│   ├── auth/               # 認証ドメイン
│   │   ├── domain/         # エンティティ、値オブジェクト、リポジトリIF
│   │   └── api/            # インフラ層（API実装）
│   └── room/               # ルームドメイン
├── hooks/                  # アプリケーション層（カスタムフック）
├── lib/
│   ├── konva/              # ホワイトボード機能
│   │   ├── hooks/          # 描画ロジック、ズーム/パン、ソケット通信
│   │   └── components/     # UI表現層（ツールバー等）
│   ├── open-api/           # OpenAPIクライアント（自動生成）
│   └── react-query/        # TanStack Query設定
└── shared/                 # 共有ユーティリティ、型、定数
```

## アーキテクチャ

**レイヤードアーキテクチャ**を採用:

1. **プレゼンテーション層**: `app/`, `components/`
2. **アプリケーション層**: `hooks/`
3. **ドメイン層**: `features/*/domain/`
4. **インフラ層**: `features/*/api/`

### ホワイトボード機能 (`src/lib/konva`)

- stores経由で状態管理（直接UIから変更しない）
- hooks経由でビジネスロジックを実行
- componentsはロジックをhooksに委譲

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

- **フレームワーク**: Vitest + Testing Library
- **対象**: ドメイン層（エンティティ、値オブジェクト）、アプリケーション層（hooks）、stores
- **ファイル配置**: テスト対象と同階層に `*.test.ts(x)` を配置
- **コマンド**: `pnpm test`（実行）、`pnpm test:ui`（UIモード）

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
