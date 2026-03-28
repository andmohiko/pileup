# t3-env 導入手順

環境変数のバリデーションを型安全に行うために [t3-env](https://env.t3.gg/) を導入した。

## 1. パッケージインストール

```bash
pnpm add @t3-oss/env-nextjs zod
```

## 2. 環境変数定義ファイルの作成

`src/env.ts` を作成し、サーバー変数・クライアント変数を定義する。

```typescript
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
})
```

- `server`: サーバーサイドのみで使用する変数。`NEXT_PUBLIC_` プレフィックスなし
- `client`: クライアントサイドでも使用する変数。`NEXT_PUBLIC_` プレフィックス必須
- `runtimeEnv`: `process.env` から実際の値をマッピングする

## 3. next.config.ts でインポート

`next.config.ts` の先頭で `src/env.ts` をインポートすることで、ビルド時・起動時にバリデーションが実行される。

```typescript
import type { NextConfig } from "next";

import "./src/env.ts";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

## 4. 環境変数の使い方

アプリケーションコード内では `process.env` の代わりに `env` オブジェクトを使用する。

```typescript
import { env } from "@/env"

// 型安全にアクセスできる
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
```

## 5. 環境変数を追加するとき

1. `src/env.ts` の `server` または `client` に Zod スキーマを追加
2. `runtimeEnv` に `process.env` からのマッピングを追加
3. `.env` と `.env.example` に変数を追加

## 6. 動作確認

環境変数が不足・不正な場合、ビルドや起動時にエラーが発生する。

```
❌ Invalid environment variables: [
  {
    code: 'invalid_format',
    format: 'url',
    path: [ 'NEXT_PUBLIC_SUPABASE_URL' ],
    message: 'Invalid URL'
  }
]
```

環境変数がすべて正しい場合は以下が表示される。

```
✅ 環境変数がセットされています
```
