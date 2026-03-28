---
name: create-form
description: フォーム + Server Action による新規作成機能を実装する。react-hook-form、zodResolver、Server Action、Prisma createの一連のファイルを生成する。
disable-model-invocation: true
argument-hint: "[リソース名(例: menu, exercise)]"
---

# フォーム + DB作成機能の実装スキル

$ARGUMENTS のフォーム作成機能を実装する。

以下のファイル構成・パターンに従って実装すること。

## ファイル構成

```
src/app/(authenticated)/<リソース名の複数形>/
├── _actions/
│   ├── types.ts              # Zodスキーマ + 入力型の定義
│   └── <リソース名>-actions.ts  # Server Actions（"use server"）
└── _components/
    └── create-<リソース名>-<dialog|sheet>.tsx  # フォームUI（"use client"）
```

## Step 1: `_actions/types.ts` — Zodスキーマ + 型定義

- Zodスキーマを定義し、`z.infer` で入力型をエクスポートする
- スキーマとtypeの両方をexportすること

```typescript
import { z } from "zod"

export const create<Resource>Schema = z.object({
  // フィールド定義
})

export type Create<Resource>Input = z.infer<typeof create<Resource>Schema>
```

**参考（種目の例）:**

```typescript
import { z } from "zod"

export const createExerciseSchema = z.object({
  name: z
    .string()
    .min(1, "種目名は必須です")
    .max(50, "種目名は50文字以内で入力してください"),
  weight: z.coerce
    .number()
    .min(0, "重量は0以上で入力してください")
    .max(999, "重量は999以下で入力してください")
    .transform((v) => Math.round(v * 100) / 100),
  reps: z.coerce
    .number()
    .int("回数は整数で入力してください")
    .min(1, "回数は1以上で入力してください")
    .max(100, "回数は100以下で入力してください"),
  sets: z.coerce
    .number()
    .int("セット数は整数で入力してください")
    .min(1, "セット数は1以上で入力してください")
    .max(20, "セット数は20以下で入力してください"),
})

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>
```

## Step 2: `_actions/<リソース名>-actions.ts` — Server Action

- `"use server"` ディレクティブ必須
- plain object（Step 1の型）を引数に受け取る（FormDataは使わない）
- `getAuthUser()` で認証チェック
- Zodでサーバー側バリデーション
- `prisma.xxx.create()` でDB保存
- `revalidatePath()` でキャッシュ無効化
- エラーは `throw new Error()` でスロー

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import {
  create<Resource>Schema,
  type Create<Resource>Input,
} from "@/app/(authenticated)/<resources>/_actions/types"

export async function create<Resource>(input: Create<Resource>Input) {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("認証が必要です")
  }

  const parsed = create<Resource>Schema.safeParse(input)

  if (!parsed.success) {
    throw new Error("入力内容に誤りがあります")
  }

  await prisma.<resource>.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
  })

  revalidatePath("/<resources>")
}
```

**参考（種目の例）:**

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import {
  createExerciseSchema,
  type CreateExerciseInput,
} from "@/app/(authenticated)/exercises/_actions/types"

export async function createExercise(input: CreateExerciseInput) {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("認証が必要です")
  }

  const parsed = createExerciseSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error("入力内容に誤りがあります")
  }

  await prisma.exercise.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
  })

  revalidatePath("/exercises")
}
```

## Step 3: `_components/create-<リソース名>-<dialog|sheet>.tsx` — フォームUI

- `"use client"` ディレクティブ必須
- `react-hook-form` + `@hookform/resolvers/zod` を使用
- `useForm` に `zodResolver(schema)` を渡す
- `handleSubmit` 経由で Server Action を呼び出す
- 成功時: ダイアログを閉じ + `reset()` + `toast.success()`
- エラー時: `toast.error()`
- 送信中は `isSubmitting` で制御し、`<Spinner />` を表示
- UIは shadcn の Dialog または Sheet を使用

```tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { create<Resource> } from "@/app/(authenticated)/<resources>/_actions/<resource>-actions"
import {
  create<Resource>Schema,
  type Create<Resource>Input,
} from "@/app/(authenticated)/<resources>/_actions/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export function Create<Resource>Dialog() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Create<Resource>Input>({
    resolver: zodResolver(create<Resource>Schema),
  })

  const onSubmit = async (data: Create<Resource>Input) => {
    try {
      await create<Resource>(data)
      setOpen(false)
      reset()
      toast.success("<リソース名>を追加しました")
    } catch {
      toast.error("<リソース名>の追加に失敗しました")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ＋<リソース名>を追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><リソース名>を追加</DialogTitle>
          <DialogDescription>説明文</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* フィールドごとに以下のパターンで実装 */}
            <div className="grid gap-2">
              <Label htmlFor="fieldName">ラベル</Label>
              <Input
                id="fieldName"
                placeholder="プレースホルダー"
                {...register("fieldName")}
              />
              {errors.fieldName && (
                <p className="text-sm text-destructive">
                  {errors.fieldName.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> 追加中...
                </>
              ) : (
                "追加する"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**参考（種目の例）:**

```tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createExercise } from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import {
  createExerciseSchema,
  type CreateExerciseInput,
} from "@/app/(authenticated)/exercises/_actions/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export function CreateExerciseDialog() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseInput>({
    resolver: zodResolver(createExerciseSchema),
  })

  const onSubmit = async (data: CreateExerciseInput) => {
    try {
      await createExercise(data)
      setOpen(false)
      reset()
      toast.success("種目を追加しました")
    } catch {
      toast.error("種目の追加に失敗しました")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ＋種目を追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>種目を追加</DialogTitle>
          <DialogDescription>トレーニング種目を登録します</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">種目名</Label>
              <Input
                id="name"
                placeholder="例: ベンチプレス"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">重量 (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                max="999"
                placeholder="0"
                {...register("weight")}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">
                  {errors.weight.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reps">回数</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="100"
                placeholder="10"
                {...register("reps")}
              />
              {errors.reps && (
                <p className="text-sm text-destructive">
                  {errors.reps.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sets">セット数</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="20"
                placeholder="3"
                {...register("sets")}
              />
              {errors.sets && (
                <p className="text-sm text-destructive">
                  {errors.sets.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> 追加中...
                </>
              ) : (
                "追加する"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## 重要な注意事項

- **FormData は使わない** — `useActionState` + FormData パターンは使用禁止。必ず react-hook-form + plain object で実装する
- **パスエイリアスは `@/` を使用**
- **shadcn コンポーネント** を使用する（Button, Dialog/Sheet, Input, Label, Spinner）
- **sonner** でトースト通知
- **全画面モーダル** が必要な場合は Dialog の代わりに Sheet (`side="right"`, `className="w-full sm:max-w-full"`) を使用する
