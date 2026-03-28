import { z } from "zod"

export const createMenuSchema = z.object({
  title: z
    .string()
    .min(1, "メニュータイトルは必須です")
    .max(50, "メニュータイトルは50文字以内で入力してください"),
  exerciseIds: z
    .array(z.string())
    .min(1, "種目を1つ以上選択してください"),
})

export type CreateMenuInput = z.infer<typeof createMenuSchema>
