# FR-MENU-001: メニューの作成 + 一覧表示

メニュー（Menu）の作成機能と一覧表示を実装する。
対象: FR-MENU-001（メニューの作成）、FR-MENU-004（メニュー一覧表示）。

## Context

`/menus` は現在プレースホルダーのみ。種目（Exercise）で確立したパターン（Server Action + Zod バリデーション + フォーム）を踏襲し、メニューの作成と一覧表示を実装する。メニューは種目との多対多リレーション（MenuItem中間テーブル）を持つため、種目選択UIが必要。spec.mdの「全画面モーダル」指定に従い、shadcn Sheet を使用する。

## ファイル構成

```
src/app/(authenticated)/menus/
├── page.tsx                          # 変更: メニュー一覧取得 + 表示
├── loading.tsx                       # 変更: レイアウトに合わせたスケルトン
├── _actions/
│   ├── menu-actions.ts              # 新規: Server Actions + Zodスキーマ
│   └── types.ts                     # 新規: Action の型定義
└── _components/
    ├── menu-list.tsx                # 新規: 一覧 + 作成ボタン（Client Component）
    ├── menu-card.tsx                # 新規: メニュー1件の表示
    └── create-menu-sheet.tsx        # 新規: 作成シート（全画面モーダル）
```

## 実装ステップ

### Step 1: Action の型定義

`_actions/types.ts` に以下を実装:

- **MenuActionState**: success, errors（title, exerciseIds, _form のフィールドエラー）

### Step 2: Server Actions + Zodスキーマ

`_actions/menu-actions.ts` に以下を実装:

- **Zodスキーマ**:
  - title: string, 1〜50文字
  - exerciseIds: string[], 1件以上
- **`getMenus`**: userId でメニューを取得、`updatedAt` 降順、menuItems の件数を `_count` で取得
- **`createMenu`**: 認証チェック → Zodバリデーション → Prisma nested create で Menu + MenuItems 一括作成 → `revalidatePath("/menus")`

認証ユーザー取得: `getAuthUser()`（`@/lib/auth`）

FormData から exerciseIds は `formData.getAll("exerciseIds")` で複数値取得。

### Step 3: メニュー一覧ページ

- **page.tsx**（Server Component）: `getAuthUser()` → 未認証なら `/login` リダイレクト → `getMenus(user.id)` + `getExercises(user.id)` → `MenuList` に props で渡す
  - exercises は作成シートでの種目選択に使用
- **menu-list.tsx**（Client Component）: メニューカード一覧。空なら「登録済みのメニューがありません」。右上に「＋メニューを追加」ボタン
- **menu-card.tsx**: タイトル・種目数（Badge）・更新日時をカード形式で表示。shadcn Card 使用。将来の編集用に cursor-pointer スタイルを設定

### Step 4: 作成シート（全画面モーダル）

- **create-menu-sheet.tsx**（Client Component）: shadcn Sheet（`side="right"`, 全幅表示）
- フォーム構成:
  1. メニュータイトル入力（Input）
  2. 種目選択: 登録済み種目の Checkbox リスト
  3. 選択中の種目数をリアルタイム表示
- 種目選択は `useState` で管理、submit 時に hidden input で exerciseIds を送信
- `useActionState` で Server Action を呼び出し
- 成功時: シートを閉じ + sonner トースト
- エラー時: フィールドごとのエラーメッセージ表示
- 種目0件の場合: 「種目が登録されていません。先に種目を登録してください。」

### Step 5: loading.tsx 更新

既存スケルトンをレイアウトに合わせて更新（ヘッダー + ボタン + カード × 3）

### Step 6: ビルド確認

`pnpm build` で成功を確認

## 使用する既存リソース

- `@/lib/prisma` — Prismaクライアント（`src/lib/prisma.ts`）
- `@/lib/auth` — 認証ユーザー取得（`src/lib/auth.ts`）
- `getExercises` — 種目一覧取得（`src/app/(authenticated)/exercises/_actions/exercise-actions.ts`）
- shadcn: Sheet, Button, Input, Label, Card, Skeleton, Checkbox, Badge
- sonner — トースト通知

## 設計判断

- **Sheet vs Dialog**: spec.md の「全画面モーダル」指定に従い Sheet を使用。Dialog は小さいフォーム向き、Sheet は全画面操作向き
- **Checkbox リスト**: 種目選択は Checkbox リスト形式。ドラッグ&ドロップ並び替えは FR-MENU-002（編集）で対応
- **Prisma nested create**: Menu + MenuItems をネストした create で一括作成（明示的トランザクション不要）
- **menu-card の onClick**: 編集は今回スコープ外だが、カードのスタイルは将来の編集対応を見越して設定

## 動作確認

- `/menus` で空の一覧が表示される
- 「メニューを追加」→ シートでタイトル入力 + 種目選択 → 作成成功 → 一覧に反映
- バリデーションエラー時にエラーメッセージが表示される（タイトル未入力、種目未選択）
- メニューカードにタイトル・種目数・更新日時が正しく表示される
- `pnpm build` 成功
