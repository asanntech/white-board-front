# ベースイメージとしてNode.js 22を使用
FROM public.ecr.aws/docker/library/node:22-alpine

# ビルド引数の定義
ARG ENVIRONMENT

# Sentryの認証トークン
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# 作業ディレクトリを設定
WORKDIR /app

# Corepackを有効化してpnpmをセットアップ
RUN corepack enable && corepack prepare pnpm@latest --activate

# 依存関係ファイルをコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# 環境変数テンプレートから.envファイルを作成
RUN cp .${ENVIRONMENT}-env.tmpl .env

# アプリケーションをビルド
RUN pnpm build

# ポートを公開
EXPOSE 3000

# コンテナ起動時のデフォルトのコマンド
CMD ["pnpm", "start"]
