"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import type { ExerciseActionState } from "@/app/(authenticated)/exercises/_actions/types"

const createExerciseSchema = z.object({
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

export async function getExercises(userId: string) {
  return prisma.exercise.findMany({
    where: { userId, isDeleted: false },
    orderBy: { updatedAt: "desc" },
  })
}

export async function createExercise(
  _prevState: ExerciseActionState,
  formData: FormData,
): Promise<ExerciseActionState> {
  const user = await getAuthUser()

  if (!user) {
    return { success: false, errors: { _form: ["認証が必要です"] } }
  }

  const parsed = createExerciseSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  await prisma.exercise.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
  })

  revalidatePath("/exercises")

  return { success: true }
}
