"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import {
  createMenuSchema,
  type CreateMenuInput,
} from "@/app/(authenticated)/menus/_actions/types"

export async function getMenus(userId: string) {
  return prisma.menu.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      menuItems: {
        include: {
          exercise: {
            select: { name: true },
          },
        },
      },
    },
  })
}

export async function createMenu(input: CreateMenuInput) {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("認証が必要です")
  }

  const parsed = createMenuSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error("入力内容に誤りがあります")
  }

  await prisma.menu.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      menuItems: {
        create: parsed.data.exerciseIds.map((exerciseId) => ({
          exerciseId,
        })),
      },
    },
  })

  revalidatePath("/menus")
}
