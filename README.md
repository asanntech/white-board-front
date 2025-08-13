## はじめに

```bash
pnpm dev
```

## ソフトウェアアーキテクチャ

プロジェクト構成はレイヤードアーキテクチャを採用。

##### プレゼンテーション層

- app/
- components/

##### アプリケーション層

- hooks/

##### ドメイン・インフラストラクチャ層

- features/
  - auth/（ドメインの境界）
    - domain/（ドメイン層）
      - [...].entity.ts（ビジネスルールや業務制約をカプセル化）
      - [...].repository.ts（データアクセスの抽象インターフェース）
    - api/（インフラストラクチャ層）
  - use...Query.ts（react-query）

## エラーハンドリング

UI のレンダリング、外部連携（API）等のエラーは ErrorBoundary で一括管理。<br>
ErrorBoundary の実装は [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) を使用する。

## 認証基盤

Cognito を使用して、トークンの管理方法は JWT 認証を採用。<br>

#### JWT 認証フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as フロントエンド
    participant B as Next.js（サーバー）
    participant C as Cognito
    participant DB as Nest.js（バックエンド）

    Note over U,DB: 1. 認証フロー
    U->>F: ログイン要求
    F->>C: 認証コード要求
    C->>F: 認証コード返却
    F->>B: 認証コード送信 (/api/auth/callback)
    B->>C: トークン要求 (grant_type: authorization_code)
    C->>B: アクセストークン、IDトークン、リフレッシュトークン返却
    B->>B: Cookieにトークン保存
    B->>F: リダイレクト (room/1)

    Note over U,DB: 2. トークン検証・取得
    F->>B: トークン取得要求 (/api/token)
    B->>B: Cookieからトークン取得
    alt トークン有効期限切れ
        B->>C: リフレッシュトークン要求 (grant_type: refresh_token)
        C->>B: 新しいアクセストークン、IDトークン返却
        B->>B: Cookie更新
    end
    B->>F: トークン情報返却

    Note over U,DB: 3. API呼び出し
    F->>B: API要求 (IDトークン付き)
    B->>DB: トークン検証
    DB->>B: 検証結果
    B->>F: API応答

    Note over U,DB: 4. ログアウト
    U->>F: ログアウト要求
    F->>B: トークン削除要求 (/api/token DELETE)
    B->>B: Cookieからトークン削除
    B->>F: 削除完了
    F->>C: Cognitoログアウト
    C->>F: ログアウト完了
```

#### セキュリティアーキテクチャの採用理由

##### XSS 対策

- HttpOnly Cookie を使用することで、悪意のあるスクリプトによるトークンの盗難を防止
- フロントエンドでトークンを直接扱わず、Next.js サーバーサイドでのみ Cookie 操作を実行

##### CSRF 対策

- Cookie の SameSite 属性により、異なるドメインからの不正なリクエストをブロック
- 各 API リクエスト時にサーバーサイドでトークンの有効性を検証

##### その他のセキュリティ対策

- アクセストークンは 15 分で期限切れ、リフレッシュトークンで自動更新
- 本番環境では HTTPS 通信を強制し、通信の暗号化を確保
- AWS Cognito による認証基盤の活用で、セキュリティベストプラクティスを継承
