# FR-EXERCISE-001: 種目の作成 + 一覧表示

種目（Exercise）の作成機能と一覧表示を実装する。
対象: FR-EXERCISE-001（種目の作成）、FR-EXERCISE-004（種目一覧表示）。

## Context

`/exercises` は現在プレースホルダーのみ。Server Actions を使った CRUD 実装の第一弾として、種目の作成と一覧表示を実装する。ここで確立するパターン（Server Action + Zod バリデーション + Dialog フォーム）を後続機能でも踏襲する。

## ファイル構成

```
src/app/(authenticated)/exercises/
├── page.tsx                          # 変更: 種目一覧取得 + 表示
├── loading.tsx                       # 変更: レイアウトに合わせたスケルトン
├── _actions/
│   └── exercise-actions.ts           # 新規: Server Actions + Zodスキーマ
└── _components/
    ├── exercise-list.tsx             # 新規: 一覧 + 作成ボタン（Client Component）
    ├── exercise-card.tsx             # 新規: 種目1件の表示
    └── create-exercise-dialog.tsx    # 新規: 作成ダイアログ
```

## 実装ステップ

### Step 1: Server Actions + Zodスキーマ

`_actions/exercise-actions.ts` に以下を実装:

- **Zodスキーマ**: spec.md のバリデーション仕様に準拠
  - name: string, 1〜50文字
  - weight: number, 0〜999
  - reps: int, 1〜100
  - sets: int, 1〜20
- **`getExercises`**: userId で `isDeleted=false` の種目を取得、`updatedAt` 降順
- **`createExercise`**: 認証チェック → Zodバリデーション → Prisma create → `revalidatePath("/exercises")`

認証ユーザー取得: `createClient()` → `supabase.auth.getUser()` → `prisma.user.findUnique({ where: { email } })`

### Step 2: 種目一覧ページ

- **page.tsx**（Server Component）: Supabase認証 → Prismaでユーザー取得 → `getExercises()` → `ExerciseList` に props で渡す
- **exercise-list.tsx**（Client Component）: 種目カードの一覧表示。空なら「登録済みの種目がありません」。右上に「＋種目を追加」ボタン
- **exercise-card.tsx**: 種目名・重量・回数・セット数をカード形式で表示。shadcn `Card` 使用

### Step 3: 作成ダイアログ

- **create-exercise-dialog.tsx**（Client Component）: shadcn `Dialog` でフォーム表示
- フィールド: 種目名（Input）、重量（Input type=number）、回数（Input type=number）、セット数（Input type=number）
- `useActionState` で Server Action を呼び出し
- 成功時: ダイアログを閉じ + sonner でトースト通知
- エラー時: フィールドごとのエラーメッセージ表示

### Step 4: loading.tsx 更新

既存スケルトンを実際のレイアウト（カード × 3）に合わせて更新

### Step 5: ビルド確認

`pnpm build` で成功を確認

## 使用する既存リソース

- `@/lib/prisma` — Prismaクライアント（`src/lib/prisma.ts`）
- `@/lib/supabase/server` — Supabase認証（`src/lib/supabase/server.ts`）
- shadcn: Dialog, Button, Input, Label, Card, Skeleton
- sonner — トースト通知

## 動作確認

- `/exercises` で空の一覧が表示される
- 「種目を追加」→ ダイアログでフォーム入力 → 作成成功 → 一覧に反映
- バリデーションエラー時にエラーメッセージが表示される
- `pnpm build` 成功
