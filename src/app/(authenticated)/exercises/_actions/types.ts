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

export const updateExerciseSchema = createExerciseSchema.extend({
  id: z.string().cuid(),
})

export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>
