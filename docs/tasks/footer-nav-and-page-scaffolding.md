# フッターナビゲーション & ページスキャフォールディング

スマホファーストのフッターナビゲーションを実装し、未実装画面の箱を作成する。

## 1. ファイル構造（変更後）

```
src/
├── app/
│   ├── layout.tsx                          # 変更なし
│   ├── login/page.tsx                      # 変更なし（フッターなし）
│   ├── auth/callback/route.ts              # 変更なし
│   ├── (authenticated)/
│   │   ├── layout.tsx                      # 新規: 認証チェック + フッターナビ
│   │   ├── page.tsx                        # 移動: ホーム画面
│   │   ├── loading.tsx                     # 新規: スケルトン
│   │   ├── exercises/
│   │   │   ├── page.tsx                    # 新規: 種目一覧
│   │   │   └── loading.tsx                 # 新規: スケルトン
│   │   ├── menus/
│   │   │   ├── page.tsx                    # 新規: メニュー一覧
│   │   │   └── loading.tsx                 # 新規: スケルトン
│   │   ├── training/
│   │   │   └── new/
│   │   │       ├── page.tsx                # 新規: トレーニング記録
│   │   │       └── loading.tsx             # 新規: スケルトン
│   │   └── settings/
│   │       ├── page.tsx                    # 移動: 設定画面
│   │       ├── loading.tsx                 # 新規: スケルトン
│   │       └── _components/
│   │           └── logout-button.tsx       # 移動
│   └── globals.css
├── components/
│   ├── footer-nav.tsx                      # 新規: フッターナビゲーション
│   └── ui/
```

`(authenticated)` ルートグループを使うことで、URLに影響を与えずに認証チェックとフッターナビを共通化できる。

## 2. フッターナビゲーション

`src/components/footer-nav.tsx` を Client Component として作成する。

- `usePathname()` でアクティブタブをハイライト
- lucide-react アイコン: Home, Dumbbell, PenLine, ClipboardList, Settings
- 5タブ構成（トレーニング記録を中央に配置）:

| 位置 | ラベル | パス | アイコン |
|------|--------|------|---------|
| 1 | ホーム | `/` | Home |
| 2 | 種目 | `/exercises` | Dumbbell |
| 3 | 記録 | `/training/new` | PenLine |
| 4 | メニュー | `/menus` | ClipboardList |
| 5 | 設定 | `/settings` | Settings |

- `fixed bottom-0` でビューポート下部に固定
- `pb-[env(safe-area-inset-bottom)]` でPWA safe area 対応
- `grid grid-cols-5` で5等分
- アクティブ: `text-primary`、非アクティブ: `text-muted-foreground`

## 3. 認証済みレイアウト

`src/app/(authenticated)/layout.tsx` を Server Component として作成する。

- Supabase `getUser()` で認証チェック → 未認証なら `/login` リダイレクト
- `<main className="flex-1 pb-16">` で children をラップ（フッター分のパディング）
- `<FooterNav />` をレンダリング
- これにより各ページから個別の認証チェックを削除できる

## 4. 既存ページの移動

- `src/app/page.tsx` → `src/app/(authenticated)/page.tsx`
- `src/app/settings/` → `src/app/(authenticated)/settings/`
- 各ページの `if (!user) redirect("/login")` を削除（レイアウトで一括チェック）
- `user` 情報を使うページでは `getUser()` 自体は残す

## 5. プレースホルダーページ作成

タイトル + 空状態メッセージのシンプルな構成で作成する。

- `src/app/(authenticated)/exercises/page.tsx` - 「種目一覧」
- `src/app/(authenticated)/menus/page.tsx` - 「メニュー一覧」
- `src/app/(authenticated)/training/new/page.tsx` - 「トレーニング記録」

## 6. loading.tsx（スケルトン）作成

CLAUDE.md のルール「画面遷移するときはスケルトンを表示すること」に従い、全ページディレクトリに `loading.tsx` を配置する。shadcn の `Skeleton` コンポーネントを使用。

## 7. 旧ファイル削除

移動元の以下を削除する:

- `src/app/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/settings/_components/logout-button.tsx`

## 8. 動作確認

- `pnpm build` でビルド成功を確認
- 各パス (`/`, `/exercises`, `/menus`, `/training/new`, `/settings`) が正しく表示される
- フッターナビでページ遷移できる
- アクティブタブが正しくハイライトされる
- ログインページにフッターが表示されない
