"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import {
  createExerciseSchema,
  updateExerciseSchema,
  type CreateExerciseInput,
  type UpdateExerciseInput,
} from "@/app/(authenticated)/exercises/_actions/types"

export async function getExercises(userId: string) {
  return prisma.exercise.findMany({
    where: { userId, isDeleted: false },
    orderBy: { updatedAt: "desc" },
  })
}

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

export async function updateExercise(input: UpdateExerciseInput) {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("認証が必要です")
  }

  const parsed = updateExerciseSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error("入力内容に誤りがあります")
  }

  const { id, ...data } = parsed.data

  const exercise = await prisma.exercise.findUnique({
    where: { id, userId: user.id },
  })

  if (!exercise) {
    throw new Error("種目が見つかりません")
  }

  await prisma.exercise.update({
    where: { id },
    data,
  })

  revalidatePath("/exercises")
}

export async function deleteExercise(id: string) {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("認証が必要です")
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id, userId: user.id },
    include: { menuItems: true },
  })

  if (!exercise) {
    throw new Error("種目が見つかりません")
  }

  if (exercise.menuItems.length > 0) {
    throw new Error("メニューに紐づいている種目は削除できません")
  }

  await prisma.exercise.update({
    where: { id },
    data: { isDeleted: true },
  })

  revalidatePath("/exercises")
}
