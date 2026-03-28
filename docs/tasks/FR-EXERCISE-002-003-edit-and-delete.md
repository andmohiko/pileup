# FR-EXERCISE-002/003: 種目の編集・削除

種目（Exercise）の編集機能と削除機能を実装する。
対象: FR-EXERCISE-002（種目の編集）、FR-EXERCISE-003（種目の削除）。

## Context

`/exercises` には作成(FR-EXERCISE-001)と一覧表示(FR-EXERCISE-004)が実装済み。`create-exercise-dialog.tsx` で確立されたパターン（Server Action + useActionState + Dialog）を踏襲し、編集・削除機能を追加する。

**UIパターン**: カードタップで編集ダイアログを開き、ダイアログの一番下に赤い削除ボタンを配置する。

## ファイル構成

```
src/app/(authenticated)/exercises/
├── page.tsx                          # 変更なし
├── loading.tsx                       # 変更なし
├── _actions/
│   ├── exercise-actions.ts           # 変更: updateExercise, deleteExercise 追加
│   └── types.ts                      # 変更: DeleteExerciseActionState 追加
└── _components/
    ├── exercise-list.tsx             # 変更なし
    ├── exercise-card.tsx             # 変更: "use client" + カードタップで編集ダイアログを開く
    ├── create-exercise-dialog.tsx    # 変更なし
    └── edit-exercise-dialog.tsx      # 新規: 編集ダイアログ（下部に削除ボタン含む）
```

## 実装ステップ

### Step 1: shadcn AlertDialog インストール

削除確認用の AlertDialog を追加する。

```bash
pnpm dlx shadcn@latest add alert-dialog
```

### Step 2: types.ts の拡張

`DeleteExerciseActionState` を追加。削除はフォームフィールドがないため `_form` エラーのみ。

### Step 3: Server Actions の追加（exercise-actions.ts）

- **`updateExercise`**: 認証チェック → Zodバリデーション → 所有者チェック → `prisma.exercise.update()` → `revalidatePath("/exercises")`
- **`deleteExercise`**: 認証チェック → 所有者チェック → メニュー紐づけ確認（`menuItems` リレーション） → 論理削除（`isDeleted: true`） → `revalidatePath("/exercises")`

### Step 4: exercise-card.tsx の変更

- `"use client"` に変更
- カード全体をクリッカブルにし、タップで編集ダイアログを開く
- `useState` で編集ダイアログの開閉を管理

### Step 5: 編集ダイアログ（edit-exercise-dialog.tsx）

- `create-exercise-dialog.tsx` をベースに作成
- props で `exercise`, `open`, `onOpenChange` を受け取り（外部制御）
- 各フィールドの `defaultValue` に exercise の現在値を設定
- `useActionState` で `updateExercise` を呼び出し
- 成功時: ダイアログを閉じ + トースト通知
- **ダイアログ下部に赤い削除ボタンを配置**
- 削除ボタン押下 → AlertDialog で確認 → `deleteExercise` 実行
- メニュー紐づけエラー時はトーストでエラー表示

### Step 6: ビルド確認

`pnpm build` で成功を確認

## 使用する既存リソース

- `@/lib/prisma` — Prismaクライアント（`src/lib/prisma.ts`）
- `@/lib/auth` — `getAuthUser()`（`src/lib/auth.ts`）
- `@/app/(authenticated)/exercises/_actions/types` — ExerciseActionState
- shadcn: Dialog, Button, Input, Label, Card, AlertDialog
- sonner — トースト通知

## 動作確認

- カードタップ → 編集ダイアログに現在値が表示される
- 値を変更して「更新する」→ 更新成功 → 一覧に反映 + トースト通知
- バリデーションエラー時にフィールドごとのエラーメッセージが表示される
- ダイアログ下部の赤い「削除」→ 確認ダイアログ → 論理削除 → 一覧から消える + トースト通知
- メニューに紐づいている種目の削除 → エラートースト表示
- `pnpm build` 成功
