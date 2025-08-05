This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
pnpm dev
```

## Software Architecture

プロジェクト構成はレイヤードアーキテクチャを採用

##### プレゼンテーション層

- app/
- components/

##### アプリケーション層

- hooks/

##### ドメイン・インフラストラクチャ層

- /features
  - /auth（ドメインの境界）
    - domain/（ドメイン層）
    - api/（インフラストラクチャ層）
  - use...Query.ts（react-query）
